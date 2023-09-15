import { APIGatewayProxyEventQueryStringParameters, APIGatewayProxyEventV2 } from 'aws-lambda';

export const GetUserEvent = (querys?: APIGatewayProxyEventQueryStringParameters): APIGatewayProxyEventV2 => ({
  version: '2.0',
  routeKey: 'ANY /user',
  rawPath: '/user',
  rawQueryString: '', // not use rawQueryString at test event
  headers: {
    accept: '*/*',
    'accept-encoding': 'gzip, deflate, br',
    'content-length': '0',
    host: 'wmvjkovs86.execute-api.us-east-1.amazonaws.com',
    'user-agent': 'testUserAgent',
    'x-amzn-trace-id': 'Root=1-64f9567c-0721b50d21e84aa70b460205',
    'x-forwarded-port': '443',
    'x-forwarded-proto': 'https',
  },
  queryStringParameters: { ...querys },
  requestContext: {
    accountId: 'testAccountId',
    apiId: 'testApiId',
    domainName: 'wmvjkovs86.execute-api.us-east-1.amazonaws.com',
    domainPrefix: 'wmvjkovs86',
    http: {
      method: 'GET',
      path: '/user',
      protocol: 'HTTP/1.1',
      sourceIp: '123.123.123.123',
      userAgent: 'testUserAgent',
    },
    requestId: 'testRequestId',
    routeKey: 'ANY /room',
    stage: '$default',
    time: '07/Sep/2023:04:50:04 +0000',
    timeEpoch: 1694062204087,
  },
  isBase64Encoded: false,
});

export const CreateUserEvent = (body: any): APIGatewayProxyEventV2 => ({
  version: '2.0',
  routeKey: 'ANY /user',
  rawPath: '/user',
  rawQueryString: ``,
  headers: {
    accept: '*/*',
    'accept-encoding': 'gzip, deflate, br',
    'content-length': '0',
    host: 'wmvjkovs86.execute-api.us-east-1.amazonaws.com',
    'user-agent': 'testUserAgent',
    'x-amzn-trace-id': 'Root=1-64f9567c-0721b50d21e84aa70b460205',
    'x-forwarded-port': '443',
    'x-forwarded-proto': 'https',
  },
  queryStringParameters: {},
  requestContext: {
    accountId: 'testAccountId',
    apiId: 'testApiId',
    domainName: 'wmvjkovs86.execute-api.us-east-1.amazonaws.com',
    domainPrefix: 'wmvjkovs86',
    http: {
      method: 'POST',
      path: '/user',
      protocol: 'HTTP/1.1',
      sourceIp: '123.123.123.123',
      userAgent: 'testUserAgent',
    },
    requestId: 'testRequestId',
    routeKey: 'ANY /room',
    stage: '$default',
    time: '07/Sep/2023:04:50:04 +0000',
    timeEpoch: 1694062204087,
  },
  body: JSON.stringify(body), // include body
  isBase64Encoded: false,
});
