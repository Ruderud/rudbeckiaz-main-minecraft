import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { ROOM_TABLE_NAME, ddbDocClient } from '.';
import { APIGatewayProxyResultV2 } from 'aws-lambda';

type DeleteRoomParams = {
  id: string;
  host: string;
};

export const deleteRoom = async (params: DeleteRoomParams): Promise<APIGatewayProxyResultV2> => {
  await ddbDocClient.send(
    new DeleteCommand({
      TableName: ROOM_TABLE_NAME,
      Key: {
        id: { S: params.id },
      },
    })
  );
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `${params.id} deleted by ${params.host}`,
    }),
  };
};
