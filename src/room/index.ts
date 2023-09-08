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
  console.log('### /room event ###', event);
  const { method } = event.requestContext.http;

  try {
    switch (method) {
      case 'GET':
        return getRoom(event.queryStringParameters?.id);
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
