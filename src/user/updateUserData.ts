import { PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { ddbDocClient, USER_TABLE_NAME } from '.';
import { padNumberWithZeros } from '../utils/padNumberWithZeros';

type UpdateUserDataParams = {
  id: string;
  userName: string;
};

export const updateUserData = async (params: UpdateUserDataParams): Promise<APIGatewayProxyResultV2> => {
  try {
    const userNameWithoutSpaces = params.userName.replace(/\s/g, '');
    const response = await ddbDocClient.send(
      new ScanCommand({
        TableName: USER_TABLE_NAME,
        FilterExpression: 'userName = :userNameValue',
        ExpressionAttributeValues: {
          ':userNameValue': userNameWithoutSpaces,
        },
      })
    );

    const { $metadata, ...rest } = response as any;
    const nameCode = `#${padNumberWithZeros(rest.Count + 1)}`;

    const newItem = {
      id: params.id,
      userName: userNameWithoutSpaces,
      nameCode,
      updatedAt: new Date().toISOString(),
    };

    await ddbDocClient.send(
      new PutCommand({
        TableName: USER_TABLE_NAME,
        ConditionExpression: 'id = :idValue',
        ExpressionAttributeValues: {
          ':idValue': params.id,
        },
        Item: newItem,
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Updated to ${newItem.userName}${newItem.nameCode}.`,
        userData: newItem,
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
