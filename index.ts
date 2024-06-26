import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const config = new pulumi.Config();
const currentEnvName = config.require("currentEnvironmentName")
const orgLogin = config.require("orgLogin")
const lb = new awsx.lb.ApplicationLoadBalancer("lb");
const cluster = new aws.ecs.Cluster("cluster");

const repo = new awsx.ecr.Repository(`${currentEnvName}-${orgLogin}-ecr_repository`, {
  forceDelete: true,
});

const service = new awsx.ecs.FargateService("service", {
  cluster: cluster.arn,
  assignPublicIp: true,
  desiredCount: 2,
  taskDefinitionArgs: {
    container: {
      name: "my-service",
      image: "nginx:latest",

      cpu: 128,
      memory: 512,
      essential: true,
      portMappings: [
        {
          containerPort: 80,
          targetGroup: lb.defaultTargetGroup,
        },
      ],
    },
  },
});

export const url = pulumi.interpolate`http://${lb.loadBalancer.dnsName}`;
