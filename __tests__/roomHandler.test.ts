import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { roomHandler } from '../src';
import * as EVENTS from './events/roomEvents';

//TODO: ddb mocking test 추후 추가하기

describe('test start', () => {
  it('sample test', () => {
    expect(1).toEqual(1);
  });
  // it('should get rooms from the DynamoDB (not exist roomid param)', async () => {
  //   const event = EVENTS.GetAllRoomEvent;
  //   const res = (await roomHandler(event)) as any;
  //   const data = JSON.parse(res?.body);
  //   console.log('daga', JSON.stringify({ data }));
  //   expect(res.statusCode).toEqual(200);
  //   expect(data.rooms.length).toBeGreaterThan(0);
  // });
  // it('should get specific room from the DynamoDB (exist roomid param)', async () => {
  //   const event = EVENTS.GetRoomEvent('1694060953374');
  //   const res = (await roomHandler(event)) as any;
  //   console.log('res', res);
  //   const data = JSON.parse(res?.body);
  //   expect(res.statusCode).toEqual(200);
  //   expect(data.host).toEqual('bar');
  // });
});
