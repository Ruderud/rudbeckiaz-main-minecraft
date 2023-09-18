import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { ddbDocClient, USER_TABLE_NAME } from '.';

type UpdateUserDataParams = {
  id: string;
  userName: string;
};

export const updateUserData = async (params: UpdateUserDataParams): Promise<APIGatewayProxyResultV2> => {
  try {
    await ddbDocClient.send(
      new PutCommand({
        TableName: USER_TABLE_NAME,
        ConditionExpression: 'id = :idValue',
        ExpressionAttributeValues: {
          ':idValue': params.id,
        },
        Item: {
          ...params,
        },
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `${params.userName} updated by ${params.id}`,
        updatedItem: params,
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: `${params.userName} not updated by ${params.id} because ${error}`,
      }),
    };
  }
};
