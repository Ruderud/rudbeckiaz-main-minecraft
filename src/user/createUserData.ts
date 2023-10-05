import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { USER_TABLE_NAME, ddbDocClient } from '.';
import { PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { padNumberWithZeros } from '../utils/padNumberWithZeros';

type CreateUserDataParams = {
  userName: string;
  isTest?: boolean;
  id?: string;
};

export const createUserData = async (params: CreateUserDataParams): Promise<APIGatewayProxyResultV2> => {
  if (params.userName) {
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
    const id = uuidv4();
    const nameCode = `#${padNumberWithZeros(rest.Count + 1)}`;

    await ddbDocClient.send(
      new PutCommand({
        TableName: USER_TABLE_NAME,
        Item: {
          id: params.isTest ? params.id : id,
          userName: userNameWithoutSpaces,
          nameCode,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'created user id',
        userData: {
          id,
          userName: `${userNameWithoutSpaces}${nameCode}`,
        },
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
