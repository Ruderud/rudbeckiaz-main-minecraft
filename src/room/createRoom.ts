import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { ROOM_TABLE_NAME, ddbDocClient } from '.';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

type CreateRoomParams = {
  roomName: string;
  host: string;
};

export const createRoom = async (params: CreateRoomParams): Promise<APIGatewayProxyResultV2> => {
  await ddbDocClient.send(
    new PutCommand({
      TableName: ROOM_TABLE_NAME,
      Item: {
        id: uuidv4(),
        ...params,
      },
    })
  );
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `${params.roomName} created by ${params.host}`,
    }),
  };
};
