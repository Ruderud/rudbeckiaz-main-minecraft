import { userHandler } from '../src';
import * as USER_EVENTS from './events/userEvents';

const TEST_ID = 'test-user-id-123';
const TEST_USER = 'Im_test_user';

describe('userHandler test start', () => {
  it('should create new user to the DynamoDB', async () => {
    const createUserEvent = USER_EVENTS.CreateUserEvent({ userName: TEST_USER, isTest: true, id: TEST_ID });
    const res = (await userHandler(createUserEvent)) as any;

    const regex = new RegExp(/Im_test_user/);
    const data = JSON.parse(res?.body);

    const isMatch = regex.test(data.userData.userName);

    expect(res.statusCode).toEqual(200);
    expect(isMatch).toEqual(true);
  });
  it('should get userData by userId from the DynamoDB', async () => {
    const getUserEvent = USER_EVENTS.GetUserEvent({ id: TEST_ID });
    const res = (await userHandler(getUserEvent)) as any;
    const data = JSON.parse(res?.body);
    expect(res.statusCode).toEqual(200);
    expect(data.userData.userName).toEqual(TEST_USER);
  });
  it('should not get userData by non-exist userId from the DynamoDB', async () => {
    const getUserEvent = USER_EVENTS.GetUserEvent({ id: 'dumb' });
    const res = (await userHandler(getUserEvent)) as any;
    expect(res.statusCode).toEqual(400);
  });
  it('should update userData by userId from the DynamoDB', async () => {
    const date = new Date().toISOString();
    const reqBody = {
      id: TEST_ID,
      userName: `new_testName_${date}`,
    };
    const updateUserEvent = USER_EVENTS.UpdateUserEvent(reqBody);
    const res = (await userHandler(updateUserEvent)) as any;
    const resBody = JSON.parse(res?.body);
    expect(res.statusCode).toEqual(200);
    expect(resBody.updatedItem.userName).toEqual(reqBody.userName);
  });
  it('should not update userData by non-exist userId from the DynamoDB', async () => {
    const updateUserEvent = USER_EVENTS.UpdateUserEvent({
      id: 'dumb',
      userName: 'dumbName',
    });
    const res = (await userHandler(updateUserEvent)) as any;
    expect(res.statusCode).toEqual(400);
  });
  it('should delete userData by userId from the DynamoDB', async () => {
    const deleteUserEvent = USER_EVENTS.DeleteUserEvent({ id: TEST_ID });
    const res = (await userHandler(deleteUserEvent)) as any;
    console.log(res);
    expect(res.statusCode).toEqual(200);
  });
});
