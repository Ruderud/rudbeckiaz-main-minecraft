import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import { getRoom } from './getRoom';
import { createRoom } from './createRoom';
import { deleteRoom } from './deleteRoom';
import { updateRoom } from './updateRoom';

const client = new DynamoDBClient({ region: 'us-east-1' });
export const ddbDocClient = DynamoDBDocumentClient.from(client);
export const ROOM_TABLE_NAME = 'rudbeckiaz-main-minecraft-room';

export const roomHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  if (event.requestContext.http.userAgent !== 'testUserAgent') {
    // only Production Event Logging
    console.log('### /room event ###', event);
  }
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
        return getRoom(event.queryStringParameters);
      case 'POST':
        return createRoom(JSON.parse(String(event.body)));
      case 'DELETE':
        return deleteRoom(JSON.parse(String(event.body)));
      case 'PUT':
        return updateRoom(JSON.parse(String(event.body)));
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
