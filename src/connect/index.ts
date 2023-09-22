import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import connectHandler from './connectHandler';
import disconnectHandler from './disconnectHandler';
import wsDefaultHandler from './wsDefaultHandler';

const client = new DynamoDBClient({ region: 'us-east-1' });
export const CONNECTION_TABLE_NAME = 'rudbeckiaz-main-minecraft-connection';
export const ddbDocClient = DynamoDBDocumentClient.from(client);

export { connectHandler, disconnectHandler, wsDefaultHandler };
