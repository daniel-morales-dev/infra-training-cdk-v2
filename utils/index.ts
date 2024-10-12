import { name } from "../bin/testing-cdk-infra-lambdas";
import { BasicStackProps } from "../interfaces";

export const getCdkPropsFromCustomProps = (props: BasicStackProps) => {
  return {
    stackName: props.name,
    env: {
      account: props.account,
      region: props.region,
    },
  };
};

export const getResourceNameWithPrefix = (resourceName: string) => {
  return `${name}-${resourceName}`;
};
