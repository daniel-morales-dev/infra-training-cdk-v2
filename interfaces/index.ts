export interface BasicStackProps {
  name: string;
  env: string;
  account: string;
  region: string;
}

export interface HttpApiProps extends BasicStackProps {
  domainName: string;
  certificateArn: string;
}

export interface IBuildConfig {
  certificateArn: string;
  domainName: string;
}
