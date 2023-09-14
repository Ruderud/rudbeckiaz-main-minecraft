import { GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ROOM_TABLE_NAME, ddbDocClient } from '.';
import { APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResultV2 } from 'aws-lambda';

export const getRoom = async (querys?: APIGatewayProxyEventQueryStringParameters): Promise<APIGatewayProxyResultV2> => {
  if (querys?.id) {
    const response = await ddbDocClient.send(
      new GetCommand({
        TableName: ROOM_TABLE_NAME,
        Key: {
          id: querys.id,
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
  } else if (querys?.host) {
    const response = await ddbDocClient.send(
      new ScanCommand({
        TableName: ROOM_TABLE_NAME,
        FilterExpression: 'host = :hostValue',
        ExpressionAttributeValues: {
          ':hostValue': querys.host,
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
