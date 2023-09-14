import { APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResultV2 } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';

export const getUserData = async (
  querys?: APIGatewayProxyEventQueryStringParameters
): Promise<APIGatewayProxyResultV2> => {
  if (querys?.createid) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        id: uuidv4(),
      }),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: 'Invalid request',
    }),
  };
};
