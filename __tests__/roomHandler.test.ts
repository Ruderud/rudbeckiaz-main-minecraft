import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { roomHandler } from '../src';
import * as ROOM_EVENTS from './events/roomEvents';

//TODO: ddb mocking test 추후 추가하기

const TEST_ID = 'test-room-id-123';
const TEST_HOST = 'test host';

describe('roomHandler test start', () => {
  it('should create room to the DynamoDB', async () => {
    const body = {
      roomName: 'test room name',
      host: 'test host',
      isTest: true,
      id: TEST_ID,
    };
    const event = ROOM_EVENTS.CreateRoomEvent(body);
    const res = (await roomHandler(event)) as any;
    expect(res.statusCode).toEqual(200);
  });
  it('should get rooms from the DynamoDB (not exist query)', async () => {
    const event = ROOM_EVENTS.GetAllRoomEvent;
    const res = (await roomHandler(event)) as any;
    const data = JSON.parse(res?.body);
    expect(res.statusCode).toEqual(200);
    expect(data.Count).toBeGreaterThan(0);
  });
  it('should get specific room from the DynamoDB (exist roomid query)', async () => {
    const event = ROOM_EVENTS.GetRoomEvent({ id: TEST_ID });
    const res = (await roomHandler(event)) as any;
    const body = JSON.parse(res?.body);
    expect(res.statusCode).toEqual(200);
    expect(body.Item.id).toEqual(TEST_ID);
  });
  it('should get specific room from the DynamoDB (exist host query)', async () => {
    const event = ROOM_EVENTS.GetRoomEvent({ host: TEST_HOST });
    const res = (await roomHandler(event)) as any;
    const data = JSON.parse(res?.body);
    expect(res.statusCode).toEqual(200);
    data.Items.forEach((item: any) => {
      expect(item.host).toEqual(TEST_HOST);
    });
  });
  it('should update room to the DynamoDB', async () => {
    const date = new Date().toISOString();
    const reqBody = {
      id: TEST_ID,
      host: TEST_HOST,
      roomName: `changed test room name at ${date}`,
    };
    const updateEvent = ROOM_EVENTS.UpdateRoomEvent(reqBody);
    const res = (await roomHandler(updateEvent)) as any;
    const resBody = JSON.parse(res?.body);
    expect(res.statusCode).toEqual(200);
    expect(resBody.updatedItem.roomName).toEqual(reqBody.roomName);
  });
  it('should not update room to the DynamoDB (non-exist roomid)', async () => {
    const updateEvent = ROOM_EVENTS.UpdateRoomEvent({
      id: 'dumb',
      host: TEST_HOST,
      roomName: 'dumbName',
    });
    const res = (await roomHandler(updateEvent)) as any;
    expect(res.statusCode).toEqual(400);
  });
  it('should not update room to the DynamoDB (not host)', async () => {
    const updateEvent = ROOM_EVENTS.UpdateRoomEvent({
      id: TEST_ID,
      host: 'im not host',
      roomName: 'dumbName',
    });
    const res = (await roomHandler(updateEvent)) as any;
    expect(res.statusCode).toEqual(400);
  });
  it('should delete room to the DynamoDB', async () => {
    const reqBody = {
      id: TEST_ID,
      host: TEST_HOST,
    };
    const deleteEvent = ROOM_EVENTS.DeleteRoomEvent(reqBody);
    const res = (await roomHandler(deleteEvent)) as any;
    const resBody = JSON.parse(res?.body);
    expect(res.statusCode).toEqual(200);
    expect(resBody.message).toEqual(`${reqBody.id} deleted by ${reqBody.host}`);
  });
});
