import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { ROOM_TABLE_NAME, ddbDocClient } from '.';

type UpdateRoomParams = {
  id: string;
  host: string;
  roomName: string;
};

export const updateRoom = async (params: UpdateRoomParams): Promise<APIGatewayProxyResultV2> => {
  try {
    await ddbDocClient.send(
      new PutCommand({
        TableName: ROOM_TABLE_NAME,
        ConditionExpression: 'host = :hostValue',
        ExpressionAttributeValues: {
          ':hostValue': params.host,
        },
        Item: {
          ...params,
        },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `${params.roomName} updated by ${params.host}`,
        updatedItem: params,
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: `${params.roomName} not updated by ${params.host} because ${error}`,
      }),
    };
  }
};
