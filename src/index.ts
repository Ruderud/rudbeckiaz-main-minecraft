import { Handler } from 'aws-lambda';
import { roomHandler } from './room/roomHandler';

const entryHandler: Handler = async (event) => {
  console.log('entryHandler', event);
  return {
    status: 200,
  };
};

export { entryHandler, roomHandler };
