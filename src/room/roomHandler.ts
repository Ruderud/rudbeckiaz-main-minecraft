import { Handler, APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { DynamoDBClient, ListTablesCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });
const command = new ListTablesCommand({});
const tableName = 'rudbeckiaz-main-minecraft-room';

export const roomHandler: APIGatewayProxyHandlerV2 = async (event) => {
  console.log('### event ###', event);
  const { method } = event.requestContext.http;
  try {
    switch (method) {
      case 'GET':
        break;
      case 'POST':
        const body = JSON.parse(String(event.body));

        const result = await client.send(
          new PutItemCommand({
            TableName: tableName,
            Item: {
              id: { S: String(Date.now()) },
              roomName: { S: body.name },
              host: { S: body.host },
            },
            ReturnValues: 'ALL_OLD',
          })
        );
        return {
          statusCode: 200,
          body: JSON.stringify(result),
        };
      case 'DELETE':
        break;
      case 'PUT':
        break;
      default:
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: 'nothing',
          }),
        };
    }
  } catch (error) {
    console.error(`### ERROR ### ${error}`);
    return {
      status: 500,
      body: JSON.stringify({
        message: 'Error occurred',
      }),
    };
  }

  return {
    status: 400,
    body: JSON.stringify({
      message: 'Invalid request',
    }),
  };
};

export const add = (x: number, y: number) => x + y;
