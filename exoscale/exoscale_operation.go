package exoscale

import (
	"context"
	"errors"
	"fmt"
	"time"

	v3 "github.com/exoscale/egoscale/v3"
	"github.com/rancher/kontainer-engine/types"
	"github.com/sirupsen/logrus"
	"k8s.io/apimachinery/pkg/util/wait"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
)

const (
	retryInterval              = 5 * time.Second
	serviceAccountRetryTimeout = 5 * time.Minute
)

func createSKSCluster(ctx context.Context, info *types.ClusterInfo) (*types.ClusterInfo, error) {
	state, err := getState(info)
	if err != nil {
		return nil, err
	}

	logrus.Debugf("create state %s, state: %#v", state.Name, state)

	client, err := getClient(ctx, state.APIKey, state.APISecret, state.Zone)
	if err != nil {
		return nil, err
	}

	sgID, err := createSKSSecurityGroup(ctx, state)
	if err != nil {
		return nil, fmt.Errorf("create sks security group")
	}
	info.Metadata["security-group-id"] = sgID.String()

	clusterName := state.ProviderName + "-" + state.Name
	clusters, err := client.ListSKSClusters(ctx)
	if err != nil {
		return nil, fmt.Errorf("list sks cluster")
	}

	var clusterID v3.UUID
	c, err := clusters.FindSKSCluster(clusterName)
	if err != nil {
		if !errors.Is(err, v3.ErrNotFound) {
			return nil, fmt.Errorf("find sks cluster: %w", err)
		}

		op, err := client.CreateSKSCluster(ctx, v3.CreateSKSClusterRequest{
			Name:    clusterName,
			Version: state.K8sVersion,
			Level:   v3.CreateSKSClusterRequestLevel(state.Level),
			Addons: []string{
				"exoscale-cloud-controller",
				"metrics-server",
				"exoscale-container-storage-interface",
			},
			Cni: v3.CreateSKSClusterRequestCniCalico,
		})
		if err != nil {
			return nil, fmt.Errorf("create sks cluster: %w", err)
		}

		op, err = client.Wait(ctx, op, v3.OperationStateSuccess)
		if err != nil {
			return nil, fmt.Errorf("wait sks cluster: %w", err)
		}

		clusterID = op.Reference.ID
	} else {
		clusterID = c.ID
	}

	cluster, err := client.GetSKSCluster(ctx, clusterID)
	if err != nil {
		return nil, fmt.Errorf("get cluster %s node pool type %s after creation", state.Name, clusterID)
	}

	if err := createSKSNodepools(ctx, cluster, state, sgID); err != nil {
		return nil, fmt.Errorf("create sks node pools: %w", err)
	}

	info.Metadata["cluster-id"] = clusterID.String()

	return info, nil
}

func createSKSSecurityGroup(ctx context.Context, state state) (v3.UUID, error) {
	client, err := getClient(ctx, state.APIKey, state.APISecret, state.Zone)
	if err != nil {
		return "", err
	}
	sgName := state.ProviderName + "-" + state.Name

	sgs, err := client.ListSecurityGroups(ctx)
	if err != nil {
		return "", fmt.Errorf("list security group: %w", err)
	}

	sg, err := sgs.FindSecurityGroup(sgName)
	if err == nil {
		if err := createSKSSecurityGroupRules(ctx, sg.ID, state); err != nil {
			return "", fmt.Errorf("create rules on existing security group %s: %w", sg.ID, err)
		}
		return sg.ID, nil
	}

	if !errors.Is(err, v3.ErrNotFound) {
		return "", fmt.Errorf("find security group: %w", err)
	}

	op, err := client.CreateSecurityGroup(ctx, v3.CreateSecurityGroupRequest{
		Name:        sgName,
		Description: "Managed by rancher",
	})
	if err != nil {
		return "", fmt.Errorf("create sks security group: %w", err)
	}
	op, err = client.Wait(ctx, op, v3.OperationStateSuccess)
	if err != nil {
		return "", fmt.Errorf("wait sks security group: %w", err)
	}

	if err := createSKSSecurityGroupRules(ctx, op.Reference.ID, state); err != nil {
		return "", fmt.Errorf("create rules for security group %s: %w", op.Reference.ID, err)
	}

	return op.Reference.ID, nil
}

func createSKSSecurityGroupRules(ctx context.Context, sgID v3.UUID, state state) error {
	client, err := getClient(ctx, state.APIKey, state.APISecret, state.Zone)
	if err != nil {
		return err
	}

	sg, err := client.GetSecurityGroup(ctx, sgID)
	if err != nil {
		return fmt.Errorf("get security group %s: %w", sgID, err)
	}

	currents := map[int64]struct{}{}
	for _, rule := range sg.Rules {
		currents[rule.StartPort] = struct{}{}
	}

	expecteds := map[int64]v3.AddRuleToSecurityGroupRequest{
		30000: {
			Network:       "0.0.0.0/0",
			StartPort:     30000,
			EndPort:       32767,
			Protocol:      v3.AddRuleToSecurityGroupRequestProtocolTCP,
			FlowDirection: v3.AddRuleToSecurityGroupRequestFlowDirectionIngress,
		},
		10250: {
			SecurityGroup: &v3.SecurityGroupResource{ID: sgID},
			StartPort:     10250,
			EndPort:       10250,
			Protocol:      v3.AddRuleToSecurityGroupRequestProtocolTCP,
			FlowDirection: v3.AddRuleToSecurityGroupRequestFlowDirectionIngress,
		},
		4789: {
			SecurityGroup: &v3.SecurityGroupResource{ID: sgID},
			StartPort:     4789,
			EndPort:       4789,
			Protocol:      v3.AddRuleToSecurityGroupRequestProtocolUDP,
			FlowDirection: v3.AddRuleToSecurityGroupRequestFlowDirectionIngress,
		},
	}

	toCreate := map[int64]v3.AddRuleToSecurityGroupRequest{}
	for port, rule := range expecteds {
		if _, ok := currents[port]; !ok {
			toCreate[port] = rule
		}
	}

	for _, ruleReq := range toCreate {
		op, err := client.AddRuleToSecurityGroup(ctx, sgID, ruleReq)
		if err != nil {
			return fmt.Errorf("add rule %d to sks security group: %w", ruleReq.StartPort, err)
		}

		_, err = client.Wait(ctx, op, v3.OperationStateSuccess)
		if err != nil {
			return fmt.Errorf("wait rule %d to sks security group: %w", ruleReq.StartPort, err)
		}
	}

	return nil
}

// This operation need to be idempotent since create is idempotent
func createSKSNodepools(ctx context.Context, cluster *v3.SKSCluster, state state, securityGroupID v3.UUID) error {
	client, err := getClient(ctx, state.APIKey, state.APISecret, state.Zone)
	if err != nil {
		return err
	}

	currentNodePools := map[v3.UUID]InstancePoolOpts{}
	for _, pool := range cluster.Nodepools {
		currentNodePools[pool.InstanceType.ID] = InstancePoolOpts{
			Size:     pool.Size,
			DiskSize: pool.DiskSize,
		}
	}

	toCreate := map[v3.UUID]InstancePoolOpts{}
	for expectedPoolType, expectedOpts := range state.NodePools {
		if _, ok := currentNodePools[expectedPoolType]; !ok {
			toCreate[expectedPoolType] = expectedOpts
		}
	}

	for poolType, opts := range toCreate {
		poolName, err := getNodepoolName(ctx, state, poolType)
		if err != nil {
			return fmt.Errorf("get nodepool name: %w", err)
		}

		op, err := client.CreateSKSNodepool(ctx, cluster.ID, v3.CreateSKSNodepoolRequest{
			Name: poolName,
			Size: opts.Size,
			InstanceType: &v3.InstanceType{
				ID: poolType,
			},
			DiskSize: opts.DiskSize,
			SecurityGroups: []v3.SecurityGroup{
				{ID: securityGroupID},
			},
		})
		if err != nil {
			return fmt.Errorf("failed to create cluster %s node pool type %s: %w", state.Name, cluster.ID, err)
		}
		_, err = client.Wait(ctx, op, v3.OperationStateSuccess)
		if err != nil {
			return fmt.Errorf("failed to wait create cluster %s node pool type %s: %w", state.Name, cluster.ID, err)
		}
	}

	return nil
}

func getNodepoolName(ctx context.Context, state state, poolType v3.UUID) (string, error) {
	client, err := getClient(ctx, state.APIKey, state.APISecret, state.Zone)
	if err != nil {
		return "", err
	}

	it, err := client.GetInstanceType(ctx, poolType)
	if err != nil {
		return "", fmt.Errorf("get instance type: %w", err)
	}

	return fmt.Sprintf("%s-%s.%s-%s", state.ProviderName, it.Family, it.Size, state.Name), nil
}

func generateServiceAccountTokenForSKS(config *rest.Config) (string, error) {
	result := ""

	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		return "", fmt.Errorf("new for config: %w", err)
	}

	err = wait.Poll(retryInterval, serviceAccountRetryTimeout, func() (done bool, err error) {
		token, err := generateServiceAccountToken(clientset)
		if err != nil {
			logrus.Debugf("retrying on service account generation error: %s", err)
			return false, nil
		}

		result = token
		return true, nil
	})

	if err != nil {
		return "", fmt.Errorf("poll generate service account token: %w", err)
	}

	return result, nil
}
