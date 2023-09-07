import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({ region: 'us-east-1' });
const tableName = 'rudbeckiaz-main-minecraft-room';

const getRoom = async (id?: string): Promise<APIGatewayProxyResultV2> => {
  if (id) {
    const result = await client.send(
      new GetItemCommand({
        TableName: tableName,
        Key: {
          id: { S: id },
        },
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        ...result.Item,
      }),
    };
  } else {
    const result = await client.send(
      new ScanCommand({
        TableName: tableName,
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        rooms: result.Items,
        length: result.Items?.length,
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
    new PutItemCommand({
      TableName: tableName,
      Item: {
        id: { S: uuidv4() },
        roomName: { S: params.roomName },
        host: { S: params.host },
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
    new DeleteItemCommand({
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
    new PutItemCommand({
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
