import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { ROOM_TABLE_NAME, ddbDocClient } from '.';

type UpdateRoomParams = {
  id: string;
  host: string;
  roomName: string;
};

export const updateRoom = async (params: UpdateRoomParams): Promise<APIGatewayProxyResultV2> => {
  const result = await ddbDocClient.send(
    new PutCommand({
      TableName: ROOM_TABLE_NAME,
      Item: {
        ...params,
      },
    })
  );

  const { $metadata, ...rest } = result;

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `${params.roomName} updated by ${params.host}`,
      ...rest,
      updatedItem: params,
    }),
  };
};
