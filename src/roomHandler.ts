import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

type Event = {
  routeKey: string;
  rawPath: string;
  rawQueryString: string;
  headers: Headers;
};

const ddbClient = new DynamoDBClient({ region: 'us-east-1' });
const dynamo = DynamoDBDocumentClient.from(ddbClient);
const tableName = 'rudbeckiaz-main-minecraft';

export const roomHandler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {
  //   try {
  //     switch (event.routeKey) {
  //       case 'GET /room':
  //         break;
  //       case 'POST /room':
  //         break;
  //       case 'DELETE /room':
  //         break;
  //       case 'PUT /room':
  //         break;
  //       default:
  //         return {
  //           status: 500,
  //           body: JSON.stringify({
  //             message: 'Error occurred',
  //           }),
  //         };
  //     }
  //   } catch (error) {
  //     console.error(`### ERROR ### ${error}`);
  //     return {
  //       status: 500,
  //       body: JSON.stringify({
  //         message: 'Error occurred',
  //       }),
  //     };
  //   }

  console.log('### EVENT ###', event);

  const response: APIGatewayProxyResult = {
    statusCode: 400,
    body: JSON.stringify({
      message: 'Invalid request',
    }),
  };

  return response;
};
