import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { roomHandler } from '../src';
import * as EVENTS from './events/roomEvents';

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('test start', () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  it('should get rooms from the DynamoDB (not exist roomid param)', async () => {
    ddbMock.on(GetCommand).resolves({
      Item: {
        rooms: [{ roomName: { S: "awsome's room" }, id: { S: '1694060953374' }, host: { S: 'awsome' } }],
        length: 1,
      },
    });
    const event = EVENTS.GetAllRoomEvent;
    const res = (await roomHandler(event)) as any;
    const data = JSON.parse(res?.body);
    expect(res.statusCode).toEqual(200);
    expect(data.rooms.length).toBeGreaterThan(0);
  });
});
