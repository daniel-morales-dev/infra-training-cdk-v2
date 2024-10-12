import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import {
  ApiMapping,
  CorsHttpMethod,
  DomainName,
  HttpApi,
  HttpStage,
} from "aws-cdk-lib/aws-apigatewayv2";
import { Construct } from "constructs";
import { HttpApiProps } from "../interfaces";
import {
  getCdkPropsFromCustomProps,
  getResourceNameWithPrefix,
} from "../utils";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";

export class HttpApiStack extends Stack {
  public readonly httpApi: HttpApi;
  public readonly domain: DomainName;
  public readonly stage: HttpStage;
  public readonly apiMapping: ApiMapping;

  constructor(scope: Construct, id: string, props: HttpApiProps) {
    super(scope, id, getCdkPropsFromCustomProps(props));
    const certificate = Certificate.fromCertificateArn(
      this,
      "CertificateTrainingV2",
      props.certificateArn
    );

    this.domain = new DomainName(this, "ApiGatewayDomainName", {
      domainName: props.domainName,
      certificate,
    });

    this.httpApi = new HttpApi(this, "ApiGatewayHttpApi", {
      apiName: `dmorales-traning-v2-${props.env}`,
      corsPreflight: {
        allowCredentials: false,
        allowHeaders: ["*"],
        allowMethods: [CorsHttpMethod.ANY],
        allowOrigins: ["*"],
      },
    });

    this.stage = new HttpStage(this, "ApiGatewayStage", {
      httpApi: this.httpApi,
      stageName: props.env,
      autoDeploy: true,
      domainMapping: {
        domainName: this.domain,
      },
    });

    this.apiMapping = new ApiMapping(this, "ApiGatewayApiMapping", {
      api: this.httpApi,
      domainName: this.domain,
      stage: this.stage,
      apiMappingKey: "v1",
    });

    new CfnOutput(this, "OutputApiGatewayHttpApiId", {
      value: this.httpApi.apiId,
      exportName: getResourceNameWithPrefix(`http-api-id-${props.env}`),
    });

    new CfnOutput(this, "OutputApiGatewayDomainName", {
      value: this.domain.name,
      exportName: getResourceNameWithPrefix(
        `api-gateway-domain-name-${props.env}`
      ),
    });
  }
}
