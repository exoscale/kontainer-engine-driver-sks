package exoscale

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
	"strings"

	v3 "github.com/exoscale/egoscale/v3"
	"github.com/exoscale/egoscale/v3/credentials"
	"github.com/rancher/kontainer-engine/drivers/options"
	"github.com/rancher/kontainer-engine/types"
	"github.com/sirupsen/logrus"
	"k8s.io/client-go/tools/clientcmd"
)

// Driver defines the struct of sks driver
type Driver struct {
	driverCapabilities types.Capabilities
}

type InstancePoolOpts struct {
	Size     int64
	DiskSize int64
}

type state struct {
	APIKey    string
	APISecret string
	// The name of this cluster
	Name         string
	ProviderName string
	// An optional description of this cluster
	Description string

	// The zone to launch the cluster
	Zone string
	// The kubernetes version
	K8sVersion string

	//NodePools sks NodePools
	NodePools map[v3.UUID]InstancePoolOpts // instance-type id -> instance pool opts

	// SKS CLuster level ("starter" or "pro")
	Level string

	// cluster info
	ClusterInfo types.ClusterInfo
}

func NewDriver() types.Driver {
	driver := &Driver{
		driverCapabilities: types.Capabilities{
			Capabilities: make(map[int64]bool),
		},
	}

	driver.driverCapabilities.AddCapability(types.GetVersionCapability)
	driver.driverCapabilities.AddCapability(types.SetVersionCapability)
	driver.driverCapabilities.AddCapability(types.GetClusterSizeCapability)
	driver.driverCapabilities.AddCapability(types.SetClusterSizeCapability)

	return driver
}

// GetDriverCreateOptions implements driver interface
func (d *Driver) GetDriverCreateOptions(ctx context.Context) (*types.DriverFlags, error) {
	driverFlag := types.DriverFlags{
		Options: make(map[string]*types.Flag),
	}

	//TODO(pej) add Exoscale NodePool Taints
	// driverFlag.Options["taints"]

	driverFlag.Options["apikey"] = &types.Flag{
		Type:  types.StringType,
		Usage: "Exoscale api key",
	}

	driverFlag.Options["apisecret"] = &types.Flag{
		Type:  types.StringType,
		Usage: "Exoscale api secret",
	}

	driverFlag.Options["name"] = &types.Flag{
		Type:  types.StringType,
		Usage: "the internal name of the cluster in Rancher",
	}
	driverFlag.Options["provider-name"] = &types.Flag{
		Type:  types.StringType,
		Usage: "the provider name of the cluster in Exoscale",
	}
	driverFlag.Options["description"] = &types.Flag{
		Type:  types.StringType,
		Usage: "An optional description of this cluster",
	}
	driverFlag.Options["level"] = &types.Flag{
		Type:  types.StringType,
		Usage: "The sks cluster level",
	}
	driverFlag.Options["zone"] = &types.Flag{
		Type:  types.StringType,
		Usage: "The zone to launch the cluster",
	}

	driverFlag.Options["kubernetes-version"] = &types.Flag{
		Type:  types.StringType,
		Usage: "The kubernetes version",
	}
	driverFlag.Options["node-pools"] = &types.Flag{
		Type:  types.StringSliceType,
		Usage: "The list of node pools created for the cluster",
	}

	return &driverFlag, nil
}

// GetDriverUpdateOptions implements driver interface
func (d *Driver) GetDriverUpdateOptions(ctx context.Context) (*types.DriverFlags, error) {
	driverFlag := types.DriverFlags{
		Options: make(map[string]*types.Flag),
	}

	driverFlag.Options["node-pools"] = &types.Flag{
		Type:  types.StringSliceType,
		Usage: "The list of node pools created for the cluster",
	}

	driverFlag.Options["level"] = &types.Flag{
		Type:  types.StringType,
		Usage: "The sks cluster level",
	}

	return &driverFlag, nil
}

// Create implements driver interface and is idempotent.
func (d *Driver) Create(ctx context.Context, opts *types.DriverOptions, currentInfo *types.ClusterInfo) (*types.ClusterInfo, error) {
	// try to get previous info/state for idempotency
	info := currentInfo
	if currentInfo == nil || currentInfo.Metadata == nil {
		state, err := getStateFromOpts(opts)
		if err != nil {
			return nil, err
		}

		info = &types.ClusterInfo{}
		err = storeState(info, state)
		if err != nil {
			return nil, err
		}
	}

	return createSKSCluster(ctx, info)
}

// Update implements driver interface
func (d *Driver) Update(ctx context.Context, info *types.ClusterInfo, opts *types.DriverOptions) (*types.ClusterInfo, error) {
	state, err := getState(info)
	if err != nil {
		return nil, err
	}

	newState, err := getStateFromOpts(opts)
	if err != nil {
		return nil, err
	}

	logrus.Debugf("Update current state %s, state: %#v", state.Name, state)
	logrus.Debugf("Update new state %s, state: %#v", newState.Name, newState)

	client, err := getClient(ctx, state.APIKey, state.APISecret, state.Zone)
	if err != nil {
		return info, err
	}

	securityGroupID, err := v3.ParseUUID(info.Metadata["security-group-id"])
	if err != nil {
		return nil, fmt.Errorf("get security-group-id: %w", err)
	}

	clusterID, err := v3.ParseUUID(info.Metadata["cluster-id"])
	if err != nil {
		return nil, fmt.Errorf("update: %w", err)
	}

	sksCluster, err := client.GetSKSCluster(ctx, clusterID)
	if err != nil {
		return nil, fmt.Errorf("get sks cluster: %w", err)
	}

	updateOpts := v3.UpdateSKSClusterRequest{}
	shouldUpdate := false

	if state.ProviderName != newState.ProviderName && sksCluster.Name != newState.ProviderName {
		updateOpts.Name = newState.ProviderName + "-" + newState.Name
		state.ProviderName = newState.ProviderName
		shouldUpdate = true
	}

	if shouldUpdate {
		op, err := client.UpdateSKSCluster(ctx, clusterID, updateOpts)
		if err != nil {
			return nil, fmt.Errorf("failed to update cluster %s: %s", clusterID, err)
		}

		_, err = client.Wait(ctx, op, v3.OperationStateSuccess)
		if err != nil {
			return nil, fmt.Errorf("wait update cluster %s: %s", clusterID, err)
		}
	}

	pm := make(map[v3.UUID]v3.SKSNodepool) // type -> poolOpts
	for _, pool := range sksCluster.Nodepools {
		if _, found := newState.NodePools[pool.InstanceType.ID]; !found {
			op, err := client.DeleteSKSNodepool(ctx, clusterID, pool.ID)
			if err != nil {
				return nil, fmt.Errorf("failed to delete cluster %s node pool %s: %w", state.Name, pool.ID, err)
			}

			_, err = client.Wait(ctx, op, v3.OperationStateSuccess)
			if err != nil {
				return nil, fmt.Errorf("failed to wait delete cluster %s node pool %s: %w", state.Name, pool.ID, err)
			}
		} else {
			pm[pool.InstanceType.ID] = pool
		}

		delete(state.NodePools, pool.InstanceType.ID)
	}

	for t, opts := range newState.NodePools {
		if cur, ok := pm[t]; ok {
			newPoolName, err := getNodepoolName(ctx, newState, t)
			if err != nil {
				return nil, fmt.Errorf("get nodepool name: %w", err)
			}

			var shouldUpdate bool
			updateOpts := v3.UpdateSKSNodepoolRequest{}
			if cur.Name != newPoolName {
				shouldUpdate = true
				updateOpts.Name = newPoolName
				state.NodePools[t] = opts
			}

			if cur.DiskSize != opts.DiskSize {
				shouldUpdate = true
				updateOpts.DiskSize = opts.DiskSize
				state.NodePools[t] = opts
			}

			if shouldUpdate {
				op, err := client.UpdateSKSNodepool(ctx, clusterID, cur.ID, updateOpts)
				if err != nil {
					return nil, fmt.Errorf("failed to scale cluster %s node pool disk size %s: %w", state.Name, cur.ID, err)
				}

				_, err = client.Wait(ctx, op, v3.OperationStateSuccess)
				if err != nil {
					return nil, fmt.Errorf("wait scale cluster %s node pool disk size %s: %w", state.Name, cur.ID, err)
				}
			}

			if cur.Size != opts.Size {
				op, err := client.ScaleSKSNodepool(ctx, clusterID, cur.ID, v3.ScaleSKSNodepoolRequest{
					Size: opts.Size,
				})
				if err != nil {
					return nil, fmt.Errorf("failed to scale cluster %s node pool type %s: %w", state.Name, cur.ID, err)
				}

				_, err = client.Wait(ctx, op, v3.OperationStateSuccess)
				if err != nil {
					return nil, fmt.Errorf("failed to wait scale cluster %s node pool type %s: %w", state.Name, cur.ID, err)
				}

				state.NodePools[t] = opts
			}
		} else {
			poolName, err := getNodepoolName(ctx, newState, t)
			if err != nil {
				return nil, fmt.Errorf("get nodepool name: %w", err)
			}

			op, err := client.CreateSKSNodepool(ctx, clusterID, v3.CreateSKSNodepoolRequest{
				Name: poolName,
				Size: opts.Size,
				InstanceType: &v3.InstanceType{
					ID: t,
				},
				DiskSize:       opts.DiskSize,
				SecurityGroups: []v3.SecurityGroup{{ID: securityGroupID}},
			})
			if err != nil {
				return nil, fmt.Errorf("failed to create cluster %s node pool type %s: %w", state.Name, cur.ID, err)
			}
			_, err = client.Wait(ctx, op, v3.OperationStateSuccess)
			if err != nil {
				return nil, fmt.Errorf("failed to wait create cluster %s node pool type %s: %w", state.Name, cur.ID, err)
			}

			state.NodePools[t] = opts
		}
	}

	// Update the level in last to prevent API conflict update issues (cluster upgrade trigger nodepools update)
	if state.Level != newState.Level && sksCluster.Level != v3.SKSClusterLevelPro {
		op, err := client.UpgradeSKSClusterServiceLevel(ctx, clusterID)
		if err != nil {
			return nil, fmt.Errorf("failed to upgrade servive level cluster %s: %s", clusterID, err)
		}
		_, err = client.Wait(ctx, op, v3.OperationStateSuccess)
		if err != nil {
			return nil, fmt.Errorf("wait upgrade servive level cluster %s: %s", clusterID, err)
		}

		state.Level = string(v3.SKSClusterLevelPro)
	}

	return info, storeState(info, state)
}

func (d *Driver) PostCheck(ctx context.Context, info *types.ClusterInfo) (*types.ClusterInfo, error) {
	state, err := getState(info)
	if err != nil {
		return nil, err
	}

	logrus.Debugf("post check state %s, state: %#v", state.Name, state)

	var kubeconfig string
	if exists(info.Metadata, "KubeConfig") {
		kubeconfig = info.Metadata["KubeConfig"]
	} else {
		// Only load Kubeconfig during first run
		client, err := getClient(ctx, state.APIKey, state.APISecret, state.Zone)
		if err != nil {
			return info, fmt.Errorf("get client: %w", err)
		}

		clusterID, err := v3.ParseUUID(info.Metadata["cluster-id"])
		if err != nil {
			return nil, fmt.Errorf("parse cluster uuid: %w", err)
		}

		sksConfig, err := client.GenerateSKSClusterKubeconfig(ctx, clusterID, v3.SKSKubeconfigRequest{
			User:   "kubernetes-admin",
			Groups: []string{"system:masters"},
		})
		if err != nil {
			return nil, fmt.Errorf("failed to get kubeconfig for SKS cluster %s: %s", clusterID, err)
		}
		kubeconfig = sksConfig.Kubeconfig
	}

	kubeConfigBytes, err := base64.StdEncoding.DecodeString(kubeconfig)
	if err != nil {
		return nil, fmt.Errorf("failed to decode kubeconfig: %s", err)
	}

	config, err := clientcmd.RESTConfigFromKubeConfig(kubeConfigBytes)
	if err != nil {
		return nil, fmt.Errorf("failed to parse SKS cluster kubeconfig: %s", err)
	}

	info.Version = state.K8sVersion
	var count int64
	for _, poolOpts := range state.NodePools {
		count += poolOpts.Size
	}
	info.NodeCount = int64(count)

	info.Endpoint = config.Host
	info.Username = config.Username
	info.Password = config.Password
	if len(config.CAData) > 0 {
		info.RootCaCertificate = base64.StdEncoding.EncodeToString(config.CAData)
	}
	if len(config.CertData) > 0 {
		info.ClientCertificate = base64.StdEncoding.EncodeToString(config.CertData)
	}
	if len(config.KeyData) > 0 {
		info.ClientKey = base64.StdEncoding.EncodeToString(config.KeyData)
	}

	info.Metadata["KubeConfig"] = kubeconfig
	serviceAccountToken, err := generateServiceAccountTokenForSKS(config)
	if err != nil {
		return nil, fmt.Errorf("generate service account token for SKS: %s", err)
	}

	info.ServiceAccountToken = serviceAccountToken
	return info, nil
}

// Remove implements driver interface
// this call is idempotent
func (d *Driver) Remove(ctx context.Context, info *types.ClusterInfo) error {
	state, err := getState(info)
	if err != nil {
		return err
	}

	logrus.Debugf("remove state.name %s, state: %#v", state.Name, state)

	client, err := getClient(ctx, state.APIKey, state.APISecret, state.Zone)
	if err != nil {
		return err
	}

	clusterID, err := v3.ParseUUID(info.Metadata["cluster-id"])
	if err != nil {
		return fmt.Errorf("remove: %w", err)
	}

	sgID, err := v3.ParseUUID(info.Metadata["security-group-id"])
	if err != nil {
		return fmt.Errorf("remove: %w", err)
	}

	logrus.Debugf("Removing cluster %v from zone %v", state.Name, state.Zone)

	sksCluster, err := client.GetSKSCluster(ctx, clusterID)
	if err != nil {
		if !errors.Is(err, v3.ErrNotFound) {
			return fmt.Errorf("failed to get Exoscale SKS cluster %s: %s", clusterID, err)
		}
	} else {
		for _, pool := range sksCluster.Nodepools {
			op, err := client.DeleteSKSNodepool(ctx, clusterID, pool.ID)
			if err != nil {
				return fmt.Errorf("failed to delete Exoscale SKS nodepool %s: %s", pool.ID, err)
			}

			_, err = client.Wait(ctx, op, v3.OperationStateSuccess)
			if err != nil {
				return fmt.Errorf("failed to wait delete Exoscale SKS nodepool %s: %s", pool.ID, err)
			}
		}
	}

	op, err := client.DeleteSKSCluster(ctx, clusterID)
	if err != nil {
		if !errors.Is(err, v3.ErrNotFound) {
			return fmt.Errorf("failed to delete Exoscale SKS cluster %s: %s", clusterID, err)
		}
	} else {
		_, err = client.Wait(ctx, op, v3.OperationStateSuccess)
		if err != nil {
			return fmt.Errorf("failed to wait delete Exoscale SKS cluster %s: %s", clusterID, err)
		}
	}

	op, err = client.DeleteSecurityGroup(ctx, sgID)
	if err != nil {
		if !errors.Is(err, v3.ErrNotFound) {
			return fmt.Errorf("failed to delete Exoscale SKS security-group %s: %s", sgID, err)
		}
	} else {
		_, err = client.Wait(ctx, op, v3.OperationStateSuccess)
		if err != nil {
			return fmt.Errorf("wait delete Exoscale SKS security-group %s: %s", sgID, err)
		}
	}

	return nil
}

func (d *Driver) GetClusterSize(ctx context.Context, info *types.ClusterInfo) (*types.NodeCount, error) {
	state, err := getState(info)
	if err != nil {
		return nil, err
	}

	logrus.Debugf("get cluster size state %s, state: %#v", state.Name, state)

	client, err := getClient(ctx, state.APIKey, state.APISecret, state.Zone)
	if err != nil {
		return nil, err
	}

	clusterID, err := v3.ParseUUID(info.Metadata["cluster-id"])
	if err != nil {
		return nil, fmt.Errorf("remove: %w", err)
	}

	sksCluster, err := client.GetSKSCluster(ctx, clusterID)
	if err != nil {
		return nil, fmt.Errorf("failed to get Exoscale SKS cluster %s: %s", clusterID, err)
	}

	var count int64
	for _, pool := range sksCluster.Nodepools {
		count += pool.Size
	}
	return &types.NodeCount{Count: int64(count)}, nil
}

func (d *Driver) GetVersion(ctx context.Context, info *types.ClusterInfo) (*types.KubernetesVersion, error) {
	state, err := getState(info)
	if err != nil {
		return nil, err
	}

	logrus.Debugf("get version state %s, state: %#v", state.Name, state)

	client, err := getClient(ctx, state.APIKey, state.APISecret, state.Zone)
	if err != nil {
		return nil, err
	}

	clusterID, err := v3.ParseUUID(info.Metadata["cluster-id"])
	if err != nil {
		return nil, fmt.Errorf("remove: %w", err)
	}

	sksCluster, err := client.GetSKSCluster(ctx, clusterID)
	if err != nil {
		return nil, fmt.Errorf("failed to get Exoscale SKS cluster %s: %s", clusterID, err)
	}

	return &types.KubernetesVersion{Version: sksCluster.Version}, nil
}

func (d *Driver) SetClusterSize(ctx context.Context, info *types.ClusterInfo, nodeCount *types.NodeCount) error {
	state, err := getState(info)
	if err != nil {
		return err
	}

	logrus.Debugf("set cluster size state %s, state: %#v", state.Name, state)

	client, err := getClient(ctx, state.APIKey, state.APISecret, state.Zone)
	if err != nil {
		return err
	}

	clusterID, err := v3.ParseUUID(info.Metadata["cluster-id"])
	if err != nil {
		return fmt.Errorf("remove: %w", err)
	}

	sksCluster, err := client.GetSKSCluster(ctx, clusterID)
	if err != nil {
		return fmt.Errorf("failed to get Exoscale SKS cluster %s: %s", clusterID, err)
	}

	logrus.Info("updating cluster size")

	if len(sksCluster.Nodepools) == 0 {
		return fmt.Errorf("no SKS nodepool defined")
	}

	poolID := sksCluster.Nodepools[0].ID

	op, err := client.ScaleSKSNodepool(ctx, clusterID, poolID, v3.ScaleSKSNodepoolRequest{
		Size: nodeCount.Count,
	})
	if err != nil {
		return fmt.Errorf(
			"failed to update SKS Cluster %s Node Pool %s: %w",
			clusterID,
			poolID,
			err,
		)
	}
	_, err = client.Wait(ctx, op, v3.OperationStateSuccess)
	if err != nil {
		return fmt.Errorf(
			"failed to wait update SKS Cluster %s Node Pool %s: %w",
			clusterID,
			poolID,
			err,
		)
	}

	logrus.Info("cluster size updated successfully")

	return nil
}

func (d *Driver) SetVersion(ctx context.Context, info *types.ClusterInfo, version *types.KubernetesVersion) error {
	state, err := getState(info)
	if err != nil {
		return err
	}

	logrus.Debugf("set version state %s, state: %#v", state.Name, state)

	client, err := getClient(ctx, state.APIKey, state.APISecret, state.Zone)
	if err != nil {
		return err
	}

	clusterID, err := v3.ParseUUID(info.Metadata["cluster-id"])
	if err != nil {
		return fmt.Errorf("remove: %w", err)
	}

	op, err := client.UpgradeSKSCluster(ctx, clusterID, v3.UpgradeSKSClusterRequest{
		Version: version.Version,
	})
	if err != nil {
		return fmt.Errorf("failed to upgrade Exoscale SKS cluster %s: %s", clusterID, err)
	}

	_, err = client.Wait(ctx, op, v3.OperationStateSuccess)
	if err != nil {
		return fmt.Errorf("failed to wait upgrade Exoscale SKS cluster %s: %s", clusterID, err)
	}

	return nil
}

func (d *Driver) GetCapabilities(ctx context.Context) (*types.Capabilities, error) {
	return &d.driverCapabilities, nil
}

func (d *Driver) ETCDSave(ctx context.Context, clusterInfo *types.ClusterInfo, opts *types.DriverOptions, snapshotName string) error {
	return fmt.Errorf("ETCD backup operations are not implemented")
}

func (d *Driver) ETCDRestore(ctx context.Context, clusterInfo *types.ClusterInfo, opts *types.DriverOptions, snapshotName string) (*types.ClusterInfo, error) {
	return nil, fmt.Errorf("ETCD backup operations are not implemented")
}

func (d *Driver) ETCDRemoveSnapshot(ctx context.Context, clusterInfo *types.ClusterInfo, opts *types.DriverOptions, snapshotName string) error {
	return fmt.Errorf("ETCD backup operations are not implemented")
}

func (d *Driver) GetK8SCapabilities(ctx context.Context, options *types.DriverOptions) (*types.K8SCapabilities, error) {
	capabilities := &types.K8SCapabilities{
		L4LoadBalancer: &types.LoadBalancerCapabilities{
			Enabled:              true,
			Provider:             "LoadBalancer",
			ProtocolsSupported:   []string{"TCP", "UDP"},
			HealthCheckSupported: true,
		},
		NodePortRange: "30000-32767",
	}
	return capabilities, nil
}

func (d *Driver) RemoveLegacyServiceAccount(ctx context.Context, info *types.ClusterInfo) error {
	return nil
}

// SetDriverOptions implements driver interface
func getStateFromOpts(driverOptions *types.DriverOptions) (state, error) {
	d := state{
		NodePools: map[v3.UUID]InstancePoolOpts{},
		ClusterInfo: types.ClusterInfo{
			Metadata: map[string]string{},
		},
	}

	d.Name = options.GetValueFromDriverOptions(driverOptions, types.StringType, "name").(string)
	d.ProviderName = options.GetValueFromDriverOptions(driverOptions, types.StringType, "provider-name", "providerName").(string)
	d.Description = options.GetValueFromDriverOptions(driverOptions, types.StringType, "description").(string)

	d.APIKey = options.GetValueFromDriverOptions(driverOptions, types.StringType, "apikey", "apikey").(string)
	d.APISecret = options.GetValueFromDriverOptions(driverOptions, types.StringType, "apisecret", "apisecret").(string)

	d.Zone = options.GetValueFromDriverOptions(driverOptions, types.StringType, "zone").(string)
	d.Level = options.GetValueFromDriverOptions(driverOptions, types.StringType, "level").(string)
	d.K8sVersion = options.GetValueFromDriverOptions(driverOptions, types.StringType, "kubernetes-version", "kubernetesVersion").(string)

	// parsing is <instance pool type>=<size>,<disk-size>
	pools := options.GetValueFromDriverOptions(driverOptions, types.StringSliceType, "node-pools", "nodePools")
	if pools != nil {
		for _, part := range pools.(*types.StringSlice).Value {
			kv := strings.Split(part, "=")
			if len(kv) == 2 {
				opts := strings.Split(kv[1], ",")
				if len(opts) != 2 {

				}

				size, err := strconv.ParseInt(opts[0], 10, 64)
				if err != nil {
					return state{}, fmt.Errorf("failed to parse node count %v for pool of node type %s", kv[1], kv[0])
				}
				diskSize, err := strconv.ParseInt(opts[1], 10, 64)
				if err != nil {
					return state{}, fmt.Errorf("failed to parse node count %v for pool of node type %s", kv[1], kv[0])
				}
				d.NodePools[v3.UUID(kv[0])] = InstancePoolOpts{
					Size:     size,
					DiskSize: diskSize,
				}
			}
		}
	}

	return d, d.validate()
}

func (s *state) validate() error {
	if len(s.NodePools) == 0 {
		return fmt.Errorf("at least one NodePool is required")
	}
	for t, opts := range s.NodePools {
		if opts.Size <= 0 {
			return fmt.Errorf("at least 1 node required for NodePool=%s", t)
		}
	}
	return nil
}

func storeState(info *types.ClusterInfo, state state) error {
	bytes, err := json.Marshal(state)
	if err != nil {
		return err
	}
	if info.Metadata == nil {
		info.Metadata = map[string]string{}
	}
	info.Metadata["state"] = string(bytes)
	info.Metadata["zone"] = state.Zone
	return nil
}

func getState(info *types.ClusterInfo) (state, error) {
	state := state{}
	err := json.Unmarshal([]byte(info.Metadata["state"]), &state)
	return state, err
}

func getClient(ctx context.Context, apikey, apisecret, zone string) (*v3.Client, error) {
	creds := credentials.NewStaticCredentials(apikey, apisecret)
	client, err := v3.NewClient(creds)
	if err != nil {
		return nil, err
	}

	endpoint, err := client.GetZoneAPIEndpoint(ctx, v3.ZoneName(zone))
	if err != nil {
		return nil, err
	}

	return client.WithEndpoint(endpoint).WithUserAgent("Rancher 2 Cluster Node Driver"), nil
}
