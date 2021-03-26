import { Vpc } from '@aws-cdk/aws-ec2';
import { Repository } from '@aws-cdk/aws-ecr';
import { Cluster, ContainerImage, FargateService, FargateTaskDefinition, ICluster, Protocol, Secret } from '@aws-cdk/aws-ecs';
import { ApplicationListener, ApplicationLoadBalancer, ApplicationProtocol, ListenerAction, ListenerCondition, TargetGroupBase } from '@aws-cdk/aws-elasticloadbalancingv2';
import * as cdk from '@aws-cdk/core';

export class InfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'SampleVPC')

    const cluster = new Cluster(this, 'MyCluster', {
      vpc,
      clusterName: 'SampleClusterCDK'
    })

    const lb = new ApplicationLoadBalancer(this, 'ALB', { vpc, internetFacing: true })

    const listener = lb.addListener('Listener80', {
      port: 80,
      defaultAction: ListenerAction.fixedResponse(404, {
        contentType: 'text/plain', messageBody: 'Not Found'
      })
    })

    this.createService('/service-a', 'service-a', 1, cluster, listener)
    this.createService('/service-b', 'service-b', 2, cluster, listener)
  }

  createService(path : string, name : string, priority : number, cluster : ICluster, listener : ApplicationListener) {
    const repo = new Repository(this, `ServiceRepo_${name}`, { repositoryName: `sample/${name}` })

    const taskDef = new FargateTaskDefinition(this, `FargateTaskDef_${name}`, { family: `${name}` })

    const container = taskDef.addContainer('main', {
      image: ContainerImage.fromEcrRepository(repo, 'latest'),
      environment: {
        SERVICE_NAME: `${name}`,
        APP_ROOT: `/${name}`
      },
    })

    container.addPortMappings({ containerPort: 3000, protocol: Protocol.TCP })

    const service = new FargateService(this, `FargateService_${name}`, {
      cluster,
      serviceName: `${name}`,
      taskDefinition: taskDef,
      desiredCount: 1
    })

    listener.addTargets(`FargateServiceTarget_${name}`, {
      conditions: [
        ListenerCondition.pathPatterns([path])
      ],
      targets: [service],
      protocol: ApplicationProtocol.HTTP,
      priority: priority,
      healthCheck: { path: '/healthz' }
    })
  }
}
