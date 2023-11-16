
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const REGION = "eu-north-1";

const { NODE_ENV } = process.env;
const endpointConfig = NODE_ENV?.toLowerCase() === "production"
  ? null
  : { endpoint: "http://localstack:4566" };

const ddbClient = new DynamoDBClient({
  region: REGION,
  ...endpointConfig
});

export const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);