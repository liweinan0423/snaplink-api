import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const s3 = new AWS.S3();

export const hello: APIGatewayProxyHandler = async (event, _context) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message:
          "Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!",
        input: event,
      },
      null,
      2
    ),
  };
};

export const genTxtMsg: APIGatewayProxyHandler = async (event, _context) => {
  const filename = uuidv4();
  await s3
    .putObject({
      Bucket: "snaplink",
      Key: filename,
      Body: new Buffer(JSON.parse(event.body).msg),
    })
    .promise();
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        filename,
      },
      null,
      2
    ),
  };
};

export const getLinkContent: APIGatewayProxyHandler = async (
  event,
  _context
) => {
  const filename = event.queryStringParameters.name;

  const result = await s3
    .getObject({
      Bucket: "snaplink",
      Key: filename,
    })
    .promise();

  const content = result.Body.toString();

  await s3.deleteObject({
    Bucket: "snaplink",
    Key: filename,
  }).promise();
  

  return { statusCode: 200, body: content };
};
