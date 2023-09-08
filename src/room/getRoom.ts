import { GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ROOM_TABLE_NAME, ddbDocClient } from '.';
import { APIGatewayProxyResultV2 } from 'aws-lambda';

export const getRoom = async (id?: string): Promise<APIGatewayProxyResultV2> => {
  if (id) {
    const response = await ddbDocClient.send(
      new GetCommand({
        TableName: ROOM_TABLE_NAME,
        Key: {
          id: id,
        },
      })
    );
    const { $metadata, ...rest } = response;
    return {
      statusCode: 200,
      body: JSON.stringify({
        ...rest,
      }),
    };
  } else {
    const response = await ddbDocClient.send(
      new ScanCommand({
        TableName: ROOM_TABLE_NAME,
      })
    );
    const { $metadata, ...rest } = response;

    return {
      statusCode: 200,
      body: JSON.stringify({
        ...rest,
      }),
    };
  }
};
