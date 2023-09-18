import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResultV2 } from 'aws-lambda';
import { USER_TABLE_NAME, ddbDocClient } from '.';

export const getUserData = async (
  querys?: APIGatewayProxyEventQueryStringParameters
): Promise<APIGatewayProxyResultV2> => {
  try {
    if (querys?.id) {
      const response = await ddbDocClient.send(
        new GetCommand({
          TableName: USER_TABLE_NAME,
          Key: {
            id: querys.id,
          },
        })
      );
      const { $metadata, ...rest } = response;

      const { Item } = rest as any;
      if (!Item) throw new Error('User not found');

      return {
        statusCode: 200,
        body: JSON.stringify({
          userData: Item,
        }),
      };
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'error occured' + error,
      }),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: 'Invalid request',
    }),
  };
};
