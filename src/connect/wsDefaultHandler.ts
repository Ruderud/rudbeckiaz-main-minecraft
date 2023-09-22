import { APIGatewayEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { ApiGatewayManagementApi } from 'aws-sdk';

import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });
export const CONNECTION_TABLE_NAME = 'rudbeckiaz-main-minecraft-connection';
export const ddbDocClient = DynamoDBDocumentClient.from(client);

const wsDefaultHandler: Handler<APIGatewayEvent, APIGatewayProxyResult> = async (event, context) => {
  try {
    const wsClient = new ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: `https://h5mrfosj61.execute-api.us-east-1.amazonaws.com/dev`,
    });
    console.log('### wsDefaultHandler ###', event);
    const response = await ddbDocClient.send(
      new ScanCommand({
        TableName: CONNECTION_TABLE_NAME,
      })
    );

    const { $metadata, ...rest } = response;

    const { Items } = rest as any;

    const sendMessages = Items.map(async (item: any) => {
      try {
        await wsClient.postToConnection({ ConnectionId: item.id, Data: event.body }).promise();
      } catch (e) {
        console.log(e);
      }
    });

    try {
      await Promise.all(sendMessages);
    } catch (error) {
      console.error('### send Error ###', error);
    }
    return {
      statusCode: 200,
      body: JSON.stringify({}),
    };
  } catch (error) {
    console.error('### Error ###', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error occurred',
      }),
    };
  }
};

export default wsDefaultHandler;
