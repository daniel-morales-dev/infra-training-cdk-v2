#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { HttpApiStack } from "../lib/HttpApi-stack";
import { IBuildConfig } from "../interfaces";

const app = new cdk.App();

const stage = String(app.node.tryGetContext("stage"));
console.log("🚀 ~ stage:", stage);

export const name = "dmorales-training-v2";

if (!["prod", "test", "dev"].includes(stage)) {
  throw new Error(`Stage "${stage}" is not supported.`);
}

const buildConfig = app.node.tryGetContext(stage) as unknown as IBuildConfig;
console.log("🚀 ~ buildConfig:", buildConfig);

const sharedProps = {
  env: stage,
  account: "147515533111",
  region: "us-east-1",
};

new HttpApiStack(app, "HttpApiStack", {
  ...sharedProps,
  name: `${name}-http-api-${stage}`,
  certificateArn: buildConfig.certificateArn,
  domainName: buildConfig.domainName,
});
