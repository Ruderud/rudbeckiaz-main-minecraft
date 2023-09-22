import { APIGatewayEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { PutCommand } from '@aws-sdk/lib-dynamodb';

import { CONNECTION_TABLE_NAME, ddbDocClient } from '.';

const connectHandler: Handler<APIGatewayEvent, APIGatewayProxyResult> = async (event) => {
  try {
    const connectionId = event.requestContext.connectionId;
    await ddbDocClient.send(
      new PutCommand({
        TableName: CONNECTION_TABLE_NAME,
        Item: {
          id: connectionId,
        },
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Connected',
      }),
    };
  } catch (error) {
    console.error('### Error ###', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error connecting',
      }),
    };
  }
};

export default connectHandler;
