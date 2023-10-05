import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { ROOM_TABLE_NAME, ddbDocClient } from '.';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

type CreateRoomParams = {
  roomName: string;
  host: string;
  isPrivate?: boolean;
  isTest?: boolean;
  id?: string;
};

export const createRoom = async (params: CreateRoomParams): Promise<APIGatewayProxyResultV2> => {
  if (!params.roomName || !params.host) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid request (roomName and host are required)',
      }),
    };
  }

  const Item = {
    ...params,
    id: params.isTest ? params.id ?? uuidv4() : uuidv4(),
    isPrivate: params.isPrivate ?? false,
    createdAt: new Date().toISOString(),
  };

  await ddbDocClient.send(
    new PutCommand({
      TableName: ROOM_TABLE_NAME,
      Item: Item,
    })
  );
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `${params.roomName} created by ${params.host}`,
      roomData: Item,
    }),
  };
};
