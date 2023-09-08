import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { ROOM_TABLE_NAME, ddbDocClient } from '.';

type UpdateRoomParams = {
  id: string;
  host: string;
  roomName: string;
};

export const updateRoom = async (params: UpdateRoomParams): Promise<APIGatewayProxyResultV2> => {
  await ddbDocClient.send(
    new PutCommand({
      TableName: ROOM_TABLE_NAME,
      Item: {
        id: { S: params.id },
        roomName: { S: params.roomName },
        host: { S: params.host },
      },
    })
  );
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `${params.roomName} updated by ${params.host}`,
    }),
  };
};
