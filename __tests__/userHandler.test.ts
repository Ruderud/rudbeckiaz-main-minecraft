import { userHandler } from '../src';
import * as USER_EVENTS from './events/userEvents';

describe('userHandler test start', () => {
  it('should create new user to the DynamoDB', async () => {
    const userName = 'test new user';
    const createUserEvent = USER_EVENTS.CreateUserEvent({ userName });
    const res = (await userHandler(createUserEvent)) as any;

    const regex = new RegExp(/testnewuser/);
    const data = JSON.parse(res?.body);

    const isMatch = regex.test(data.userData.userName);

    expect(res.statusCode).toEqual(200);
    expect(isMatch).toEqual(true);
  });
  it('should get userData by userId from the DynamoDB', async () => {
    const getUserEvent = USER_EVENTS.GetUserEvent({
      id: 'test-id-123',
    });
    const res = (await userHandler(getUserEvent)) as any;
    const data = JSON.parse(res?.body);
    expect(res.statusCode).toEqual(200);
    expect(data.userData.userName).toEqual('testnewuser');
  });

  it('should not get userData by non-exist userId from the DynamoDB', async () => {
    const getUserEvent = USER_EVENTS.GetUserEvent({
      id: 'nope',
    });
    const res = (await userHandler(getUserEvent)) as any;
    const data = JSON.parse(res?.body);
    expect(res.statusCode).toEqual(400);
  });
});
