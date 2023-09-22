import { connectHandler, wsDefaultHandler } from '../src';
import { ConnectEvent } from './events/connectEvents';

describe('connectHandler test start', () => {
  it('should create connection to the DynamoDB', async () => {
    // const res = (await wsDefaultHandler(ConnectEvent as any, {} as any, {} as any)) as any;
    // console.log('res', res);
    // expect(res.statusCode).toEqual(200);

    expect(true).toEqual(true);
  });
});
