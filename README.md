# Sample - Containers - ECS Single ALB

This demo starts by deploying a copilot application.

## Getting Started - Deploy CDK

```bash
$ cd infra
$ cdk deploy
```


## CoPilot - Adding Parameters to SSM

```bash
$ aws ssm put-parameter \
    --name /sample-copilot/test/secret-a \
    --value secretvalue1234 \
    --type SecureString \
    --tags Key=copilot-environment,Value=test Key=copilot-application,Value=sample-copilot

$ aws ssm put-parameter \
    --name /sample-copilot/test/secret-b \
    --value secretvalue1234 \
    --type SecureString \
    --tags Key=copilot-environment,Value=test Key=copilot-application,Value=sample-copilot
```


## Can Exec into the CoPilot Service

```bash
$ copilot svc exec
```
