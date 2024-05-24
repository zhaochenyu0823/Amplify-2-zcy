import { defineBackend } from "@aws-amplify/backend";
import { Stack } from "aws-cdk-lib";
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  Cors,
  LambdaIntegration,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { sayHello } from './functions/say-hello-zcy/resource';

const backend = defineBackend({
  auth,
  data,
  sayHello,
});

// create a new API stack
const apiStack = backend.createStack("api-stack-zcy");

//来定义一个新的 REST API
const zcyRestApi = new RestApi(apiStack, "RestApi", {
  restApiName: "zcyTestRestApi",
  deploy: true,
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS, // 允许所有源
    allowMethods: Cors.ALL_METHODS, // 允许所有 HTTP 方法
    allowHeaders: Cors.DEFAULT_HEADERS, // 允许默认头部
  },
});


// create a new Lambda integration
const zcyLambdaIntegration = new LambdaIntegration(
  backend.sayHello.resources.lambda
);


// 来配置一个新的路径itmes在RestApi上 ,权限为IAM权限
const itemsPath = zcyRestApi.root
  .addResource("items", {
    defaultMethodOptions: {
      authorizationType: AuthorizationType.IAM,
    },
  });
// 为items路径上添加 Lambda函数
itemsPath.addMethod("GET", zcyLambdaIntegration);
itemsPath.addMethod("POST", zcyLambdaIntegration);
itemsPath.addMethod("DELETE", zcyLambdaIntegration);
itemsPath.addMethod("PUT", zcyLambdaIntegration);
// 将其他的子路径也定义到 这个Lambda函数上
itemsPath.addProxy({ anyMethod: true, defaultIntegration: zcyLambdaIntegration, });


// 创建Cognito 用户池权限
const cognitoAuth = new CognitoUserPoolsAuthorizer(apiStack, "CognitoAuth", {
  cognitoUserPools: [backend.auth.resources.userPool],
});

// 创建一个新的路径cognito-auth-path，将其赋予 Cognito 用户池权限
const booksPath = zcyRestApi.root
  .addResource("cognito-auth-path")
  .addMethod("GET", zcyLambdaIntegration, {
    authorizationType: AuthorizationType.COGNITO,
    authorizer: cognitoAuth,
  });


// create a new IAM policy to allow Invoke access to the API
const apiRestPolicy = new Policy(apiStack, "RestApiPolicy", {
  statements: [
    new PolicyStatement({
      actions: ["execute-api:Invoke"],
      resources: [
        `${zcyRestApi.arnForExecuteApi("items")}`,
        `${zcyRestApi.arnForExecuteApi("cognito-auth-path")}`,
      ],
    }),
  ],
});

// attach the policy to the authenticated and unauthenticated IAM roles
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(
  apiRestPolicy
);
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(
  apiRestPolicy
);

// add outputs to the configuration file
backend.addOutput({
  custom: {
    API: {
      [zcyRestApi.restApiName]: {
        endpoint: zcyRestApi.url,
        region: Stack.of(zcyRestApi).region,
        apiName: zcyRestApi.restApiName,
      },
    },
  },
});

