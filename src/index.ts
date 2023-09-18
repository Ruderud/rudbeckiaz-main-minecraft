import { Handler } from 'aws-lambda';
import { roomHandler } from './room';
import { userHandler } from './user';
import { wsDefaultHandler, connectHandler, disconnectHandler } from './connect';

const entryHandler: Handler = async (event) => {
  console.log('entryHandler', event);
  return {
    status: 200,
  };
};

export { entryHandler, roomHandler, userHandler, wsDefaultHandler, connectHandler, disconnectHandler };
