import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({ region: 'us-east-1' });
const ddbDocClient = DynamoDBDocumentClient.from(client);
const tableName = 'rudbeckiaz-main-minecraft-room';

const getRoom = async (id?: string): Promise<APIGatewayProxyResultV2> => {
  if (id) {
    const response = await ddbDocClient.send(
      new GetCommand({
        TableName: tableName,
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
        TableName: tableName,
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

type CreateRoomParams = {
  roomName: string;
  host: string;
};

const createRoom = async (params: CreateRoomParams): Promise<APIGatewayProxyResultV2> => {
  await client.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        id: uuidv4(),
        ...params,
      },
    })
  );
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `${params.roomName} created by ${params.host}`,
    }),
  };
};

type DeleteRoomParams = {
  id: string;
  host: string;
};

const deleteRoom = async (params: DeleteRoomParams): Promise<APIGatewayProxyResultV2> => {
  await client.send(
    new DeleteCommand({
      TableName: tableName,
      Key: {
        id: { S: params.id },
      },
    })
  );
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `${params.id} deleted by ${params.host}`,
    }),
  };
};

type UpdateRoomParams = {
  id: string;
  host: string;
  roomName: string;
};

const updateRoom = async (params: UpdateRoomParams): Promise<APIGatewayProxyResultV2> => {
  await client.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        id: { S: params.id },
        roomName: { S: params.roomName },
        host: { S: params.host },
      },
    })
  );
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `${params.roomName} updated by ${params.host}`,
    }),
  };
};

export const roomHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  console.log('### /room event ###', event);
  const { method } = event.requestContext.http;

  try {
    switch (method) {
      case 'GET':
        return getRoom(event.queryStringParameters?.id);
      case 'POST':
        return createRoom(JSON.parse(String(event.body)));
      case 'DELETE':
        return deleteRoom(JSON.parse(String(event.body)));
      case 'PUT':
        return updateRoom(JSON.parse(String(event.body)));
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: 'Invalid request',
          }),
        };
    }
  } catch (error) {
    console.error(`### ERROR ### ${error}`);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error occurred',
      }),
    };
  }
};
