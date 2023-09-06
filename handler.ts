import { Handler } from 'aws-lambda';
import { roomHandler } from './src';

const entryHandler: Handler = async () => {
  return {
    status: 200,
  };
};

export { entryHandler, roomHandler };
