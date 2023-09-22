import { APIGatewayEvent, Handler } from 'aws-lambda';
import { CONNECTION_TABLE_NAME, ddbDocClient } from '.';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';

const disconnectHandler: Handler<APIGatewayEvent> = async (event, context) => {
  try {
    const connectionId = event.requestContext.connectionId;
    await ddbDocClient.send(
      new DeleteCommand({
        TableName: CONNECTION_TABLE_NAME,
        Key: {
          id: connectionId,
        },
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Disconnected',
      }),
    };
  } catch (error) {
    console.error('### Error ###', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error disconnecting',
      }),
    };
  }
};

export default disconnectHandler;
