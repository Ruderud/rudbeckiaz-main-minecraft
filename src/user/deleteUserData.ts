import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { USER_TABLE_NAME, ddbDocClient } from '.';

type DeleteUserDataParams = {
  id: string;
};

export const deleteUserData = async (params: DeleteUserDataParams): Promise<APIGatewayProxyResultV2> => {
  try {
    await ddbDocClient.send(
      new DeleteCommand({
        TableName: USER_TABLE_NAME,
        Key: {
          id: params.id,
        },
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `${params.id} deleted`,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `${params.id} not deleted`,
      }),
    };
  }
};
