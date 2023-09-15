import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { getUserData } from './getUserData';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { createUserData } from './createUserData';

const client = new DynamoDBClient({ region: 'us-east-1' });
export const ddbDocClient = DynamoDBDocumentClient.from(client);
export const USER_TABLE_NAME = 'rudbeckiaz-main-minecraft-user';

export const userHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  console.log('### /user event ###', event);
  const { method } = event.requestContext.http;

  try {
    switch (method) {
      case 'OPTIONS':
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
          },
        };
      case 'GET':
        return getUserData(event.queryStringParameters);
      case 'POST':
        return createUserData(JSON.parse(String(event.body)));
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: 'Invalid request',
          }),
        };
    }
  } catch (error) {
    console.error(`### ERROR ### ${error}`);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error occurred',
      }),
    };
  }
};
