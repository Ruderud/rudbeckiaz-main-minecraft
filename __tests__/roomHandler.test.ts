import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { roomHandler } from '../src';
import * as EVENTS from './events/roomEvents';

//TODO: ddb mocking test 추후 추가하기

describe('test start', () => {
  it('should get rooms from the DynamoDB (not exist query)', async () => {
    const event = EVENTS.GetAllRoomEvent;
    const res = (await roomHandler(event)) as any;
    const data = JSON.parse(res?.body);
    expect(res.statusCode).toEqual(200);
    expect(data.Count).toBeGreaterThan(0);
  });
  it('should get specific room from the DynamoDB (exist roomid query)', async () => {
    const event = EVENTS.GetRoomEvent({
      id: '1694060953374',
    });
    const res = (await roomHandler(event)) as any;
    expect(res.statusCode).toEqual(200);
  });
  it('should get specific room from the DynamoDB (exist host query)', async () => {
    const event = EVENTS.GetRoomEvent({
      host: 'test host',
    });
    const res = (await roomHandler(event)) as any;
    const data = JSON.parse(res?.body);
    console.log('scan event', data.Items);
    expect(res.statusCode).toEqual(200);
    data.Items.forEach((item: any) => {
      expect(item.host).toEqual('test host');
    });
  });
  it('should create room to the DynamoDB', async () => {
    const body = {
      roomName: 'test room name',
      host: 'test host',
    };
    const event = EVENTS.CreateRoomEvent(body);
    const res = (await roomHandler(event)) as any;
    expect(res.statusCode).toEqual(200);
  });
  it('should delete room to the DynamoDB', async () => {
    const scanEvent = EVENTS.GetRoomEvent({
      host: 'test host',
    });
    const scanRes = (await roomHandler(scanEvent)) as any;
    const { Items } = JSON.parse(scanRes?.body);

    const body = {
      id: Items[0].id,
      host: 'test host',
    };
    const deleteEvent = EVENTS.DeleteRoomEvent(body);
    const res = (await roomHandler(deleteEvent)) as any;
    console.log('res', res);
    expect(res.statusCode).toEqual(200);
  });
});
