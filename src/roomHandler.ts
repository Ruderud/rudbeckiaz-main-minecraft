import { Handler } from 'aws-lambda';

type Event = {
  routeKey: string;
  rawPath: string;
  rawQueryString: string;
  headers: Headers;
};

export const roomHandler: Handler = async (event) => {
  return {
    status: 200,
    body: JSON.stringify({
      message: 'Hello World!',
    }),
  };
};
