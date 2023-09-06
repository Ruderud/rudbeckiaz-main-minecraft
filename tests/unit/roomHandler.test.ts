import { APIGatewayProxyResult } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { roomHandler } from '../../src/roomHandler';

// const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
  //   ddbMock.reset();
});

describe('Unit test for app handler', function () {
  /**
   * Happy path scenario, in this case we read the event for lambaHandler
   * We mock the response for DynamoDB GetCommand to produce a vailid response
   */

  it('verify happy path 200', async () => {
    // const result = await roomHandler(getRoomEvent);
    // expect(res).toEqual(1);
  });
});
