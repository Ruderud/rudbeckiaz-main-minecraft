import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { USER_TABLE_NAME, ddbDocClient } from '.';
import { PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

type CreateUserDataParams = {
  userName: string;
};

export const createUserData = async (params: CreateUserDataParams): Promise<APIGatewayProxyResultV2> => {
  if (params.userName) {
    const response = await ddbDocClient.send(
      new ScanCommand({
        TableName: USER_TABLE_NAME,
        FilterExpression: 'userName = :userNameValue',
        ExpressionAttributeValues: {
          ':userNameValue': params.userName,
        },
      })
    );

    const { $metadata, ...rest } = response as any;

    const id = uuidv4();
    const userName = `${params.userName}#${padNumberWithZeros(rest.Count + 1)}`;

    await ddbDocClient.send(
      new PutCommand({
        TableName: USER_TABLE_NAME,
        Item: {
          id,
          userName,
          createdAt: new Date().toISOString(),
        },
      })
    );

    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'created user id',
        userData: {
          id,
          userName,
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

function padNumberWithZeros(number: number) {
  // 숫자를 문자열로 변환
  let numberString = number.toString();

  // 문자열의 길이가 5가 될 때까지 앞에 0을 추가
  while (numberString.length < 5) {
    numberString = '0' + numberString;
  }

  return numberString;
}
