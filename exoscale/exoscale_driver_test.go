package exoscale

import (
	"context"
	"encoding/json"
	"sort"
	"strings"
	"testing"

	v3 "github.com/exoscale/egoscale/v3"
	"github.com/exoscale/egoscale/v3/credentials"
	"github.com/google/uuid"
	"github.com/rancher/kontainer-engine/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDriver(t *testing.T) {
	const zone = "de-fra-1"

	name := generateResourceName()
	keys, err := credentials.NewEnvCredentials().Get()
	require.NoError(t, err)
	ctx := context.Background()

	d := &Driver{}
	client, err := getClient(ctx, keys.APIKey, keys.APISecret, zone)
	require.NoError(t, err)

	kubernetesVersion := getLatestK8sVersion(t, ctx, client)
	instanceTypeMedium := getInstanceTypeID(t, ctx, client, "standard.medium").String()
	instanceTypeSmall := getInstanceTypeID(t, ctx, client, "standard.small").String()

	opts := types.DriverOptions{
		BoolOptions: nil,
		StringOptions: map[string]string{
			"name":               name,
			"provider-name":      "test-rancher",
			"apikey":             keys.APIKey,
			"apisecret":          keys.APISecret,
			"zone":               zone,
			"level":              string(v3.SKSClusterLevelStarter),
			"kubernetes-version": kubernetesVersion,
		},
		StringSliceOptions: map[string]*types.StringSlice{
			"node-pools": {
				Value: []string{
					instanceTypeMedium + "=2,50",
				},
			},
		},
	}
	info, err := d.Create(ctx, &opts, nil)
	require.NoError(t, err)

	t.Cleanup(func() {
		require.NoError(t, d.Remove(ctx, info))
	})

	info, err = d.PostCheck(ctx, info)
	require.NoError(t, err)

	validateSKSClusterProperties(t, ctx, client, info)

	v, err := d.GetVersion(ctx, info)
	require.NoError(t, err)
	require.Equal(t, kubernetesVersion, v.Version, "Kubernetes version")

	c, err := d.GetClusterSize(ctx, info)
	require.NoError(t, err)
	require.Equal(t, int64(2), c.Count, "Cluster size")

	info, err = d.Update(ctx, info, &types.DriverOptions{
		StringOptions: map[string]string{
			"name":               name,
			"provider-name":      "test-rancher-renamed",
			"apikey":             keys.APIKey,
			"apisecret":          keys.APISecret,
			"zone":               zone,
			"level":              string(v3.SKSClusterLevelPro),
			"kubernetes-version": kubernetesVersion,
		},
		StringSliceOptions: map[string]*types.StringSlice{
			"node-pools": {
				Value: []string{
					instanceTypeMedium + "=3,100",
					instanceTypeSmall + "=1,50",
				},
			},
		},
	})
	require.NoError(t, err)

	info, err = d.PostCheck(ctx, info)
	require.NoError(t, err)

	validateSKSClusterProperties(t, ctx, client, info)

	uc, err := d.GetClusterSize(ctx, info)
	require.NoError(t, err)
	require.Equal(t, int64(4), uc.Count, "Cluster size")

	info, err = d.Update(ctx, info, &types.DriverOptions{
		StringOptions: map[string]string{
			"name":               name,
			"provider-name":      "test-rancher",
			"apikey":             keys.APIKey,
			"apisecret":          keys.APISecret,
			"zone":               zone,
			"level":              string(v3.SKSClusterLevelPro),
			"kubernetes-version": kubernetesVersion,
		},
		StringSliceOptions: map[string]*types.StringSlice{
			"node-pools": {
				Value: []string{
					instanceTypeSmall + "=2,100",
				},
			},
		},
	})
	require.NoError(t, err)

	info, err = d.PostCheck(ctx, info)
	require.NoError(t, err)

	validateSKSClusterProperties(t, ctx, client, info)

	uc, err = d.GetClusterSize(ctx, info)
	require.NoError(t, err)
	require.Equal(t, int64(2), uc.Count, "Cluster size")
}

func validateSKSClusterProperties(t *testing.T, ctx context.Context, client *v3.Client, info *types.ClusterInfo) {
	clusterID, err := v3.ParseUUID(info.Metadata["cluster-id"])
	require.NoError(t, err)

	sksCluster, err := client.GetSKSCluster(ctx, clusterID)
	require.NoError(t, err)

	require.NotNil(t, info.Metadata)

	storedState, err := getState(info)
	require.NoError(t, err)

	require.Equal(t, sksCluster.Name, storedState.ProviderName+"-"+storedState.Name)
	require.Equal(t, string(sksCluster.Level), storedState.Level)
	require.Equal(t, sksCluster.Version, storedState.K8sVersion)
	var totalNodeCount int64
	for _, pool := range sksCluster.Nodepools {
		nodePoolOpts, exists := storedState.NodePools[pool.InstanceType.ID]
		require.True(t, exists, "Node pool %s not found in stored state", pool.InstanceType.ID)
		assert.Equal(t, nodePoolOpts.Size, pool.Size, "Node pool size mismatch for pool %s", pool.InstanceType.ID)
		assert.Equal(t, nodePoolOpts.DiskSize, pool.DiskSize, "Node pool disk size mismatch for pool %s", pool.InstanceType.ID)
		totalNodeCount += pool.Size
	}

	assert.Equal(t, totalNodeCount, int64(info.NodeCount), "Total node count mismatch")
}

func getLatestK8sVersion(t *testing.T, ctx context.Context, client *v3.Client) string {
	sksVersions, err := client.ListSKSClusterVersions(ctx)
	require.NoError(t, err)

	sort.Strings(sksVersions.SKSClusterVersions)

	// We should be testing on the latest version
	return sksVersions.SKSClusterVersions[len(sksVersions.SKSClusterVersions)-1]
}

// getInstanceTypeID parse <familly>.<size>
func getInstanceTypeID(t *testing.T, ctx context.Context, client *v3.Client, instanceType string) v3.UUID {
	r, err := client.ListInstanceTypes(ctx)
	require.NoError(t, err)

	inputs := strings.Split(instanceType, ".")
	require.Len(t, inputs, 2)

	for _, t := range r.InstanceTypes {
		if t.Family == v3.InstanceTypeFamily(inputs[0]) && t.Size == v3.InstanceTypeSize(inputs[1]) {
			return t.ID
		}
	}

	require.Failf(t, "no instance type found", "instance_type=%s", instanceType)
	return ""
}

func generateResourceName() string {
	return strings.Replace(uuid.New().String(), "-", "", -1)
}

func TestGetStateFromOpts(t *testing.T) {
	driverOptions := &types.DriverOptions{
		StringOptions: map[string]string{
			"name":               "test-cluster",
			"provider-name":      "exoscale",
			"description":        "test description",
			"apikey":             "test-api-key",
			"apisecret":          "test-api-secret",
			"zone":               "ch-gva-2",
			"level":              "pro",
			"kubernetes-version": "1.23.5",
		},
		StringSliceOptions: map[string]*types.StringSlice{
			"node-pools": {
				Value: []string{"pool1=3,50", "pool2=5,100"},
			},
		},
	}

	state, err := getStateFromOpts(driverOptions)
	assert.NoError(t, err)
	assert.Equal(t, "test-cluster", state.Name)
	assert.Equal(t, "exoscale", state.ProviderName)
	assert.Equal(t, "test description", state.Description)
	assert.Equal(t, "test-api-key", state.APIKey)
	assert.Equal(t, "test-api-secret", state.APISecret)
	assert.Equal(t, "ch-gva-2", state.Zone)
	assert.Equal(t, "pro", state.Level)
	assert.Equal(t, "1.23.5", state.K8sVersion)
	assert.Len(t, state.NodePools, 2)

	pool1 := state.NodePools["pool1"]
	assert.Equal(t, int64(3), pool1.Size)
	assert.Equal(t, int64(50), pool1.DiskSize)

	pool2 := state.NodePools["pool2"]
	assert.Equal(t, int64(5), pool2.Size)
	assert.Equal(t, int64(100), pool2.DiskSize)
}

func TestStoreStateAndGetState(t *testing.T) {
	st := state{
		APIKey:       "test-api-key",
		APISecret:    "test-api-secret",
		Name:         "test-cluster",
		ProviderName: "exoscale",
		Description:  "test description",
		Zone:         "ch-gva-2",
		K8sVersion:   "1.23.5",
		Level:        "pro",
		NodePools: map[v3.UUID]InstancePoolOpts{
			"pool1": {Size: 3, DiskSize: 50},
			"pool2": {Size: 5, DiskSize: 100},
		},
	}

	info := &types.ClusterInfo{
		Metadata: map[string]string{},
	}

	// Test storeState
	err := storeState(info, st)
	require.NoError(t, err)

	// Verify stored state
	storedStateJSON := info.Metadata["state"]
	var storedState state
	err = json.Unmarshal([]byte(storedStateJSON), &storedState)
	require.NoError(t, err)
	assert.Equal(t, st, storedState)

	// Test getState
	retrievedState, err := getState(info)
	require.NoError(t, err)
	assert.Equal(t, st, retrievedState)
}

func TestStateValidate(t *testing.T) {
	validState := state{
		NodePools: map[v3.UUID]InstancePoolOpts{
			"pool1": {Size: 3, DiskSize: 50},
		},
	}

	invalidStateNoNodePools := state{
		NodePools: map[v3.UUID]InstancePoolOpts{},
	}

	invalidStateZeroNodes := state{
		NodePools: map[v3.UUID]InstancePoolOpts{
			"pool1": {Size: 0, DiskSize: 50},
		},
	}

	// Test valid state
	err := validState.validate()
	assert.NoError(t, err)

	// Test invalid state with no node pools
	err = invalidStateNoNodePools.validate()
	assert.Error(t, err)
	assert.Equal(t, "at least one NodePool is required", err.Error())

	// Test invalid state with zero nodes
	err = invalidStateZeroNodes.validate()
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "at least 1 node required for NodePool")
}
