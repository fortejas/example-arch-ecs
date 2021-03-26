import { Vpc } from '@aws-cdk/aws-ec2';
import { Repository } from '@aws-cdk/aws-ecr';
import { Cluster, ContainerImage, FargateService, FargateTaskDefinition, ICluster, Secret } from '@aws-cdk/aws-ecs';
import { ApplicationLoadBalancer } from '@aws-cdk/aws-elasticloadbalancingv2';
import * as cdk from '@aws-cdk/core';

export class InfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'SampleVPC')

    const cluster = new Cluster(this, 'MyCluster', {
      vpc,
      clusterName: 'SampleClusterCDK'
    })

    new ApplicationLoadBalancer(this, 'ALB', { vpc })

    this.createService('service-a', cluster)
    this.createService('service-b', cluster)
  }

  createService(name : string, cluster : ICluster) {
    const repo = new Repository(this, `ServiceRepo_${name}`, { repositoryName: `sample/${name}` })

    const taskDef = new FargateTaskDefinition(this, `FargateTaskDef_${name}`, { family: `${name}` })
    const container = taskDef.addContainer('main', {
      image: ContainerImage.fromEcrRepository(repo, 'latest'),
      environment: {
        SERVICE_NAME: `${name}`
      },
    })

    const service = new FargateService(this, `FargateService_${name}`, {
      cluster,
      serviceName: `${name}`,
      taskDefinition: taskDef
    })
  }
}
