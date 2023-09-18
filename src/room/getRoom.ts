import { GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ROOM_TABLE_NAME, ddbDocClient } from '.';
import { APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResultV2 } from 'aws-lambda';

const getRoomById = async (id: string) => {
  const response = await ddbDocClient.send(
    new GetCommand({
      TableName: ROOM_TABLE_NAME,
      Key: {
        id,
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
};

const getRoomByHost = async (host: string) => {
  const response = await ddbDocClient.send(
    new ScanCommand({
      TableName: ROOM_TABLE_NAME,
      FilterExpression: 'host = :hostValue',
      ExpressionAttributeValues: {
        ':hostValue': host,
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
};

const getRooms = async () => {
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
};

export const getRoom = async (querys?: APIGatewayProxyEventQueryStringParameters): Promise<APIGatewayProxyResultV2> => {
  try {
    if (querys?.id) return getRoomById(querys.id);
    else if (querys?.host) return getRoomByHost(querys.host);
    else return getRooms();
  } catch (error) {
    console.log('error', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error occurred',
      }),
    };
  }
};
