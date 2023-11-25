import { Api, StackContext } from 'sst/constructs';
import { BACKEND_PATH } from './utils/constants';

export function ApiStack({ stack }: StackContext) {
  const stage = stack.stage;

  const api = new Api(stack, `${stage}-api`, {
    defaults: {},
    cors: {
      // TODO update accordingly
      allowOrigins: ['*'],
      allowHeaders: ['*'],
      allowMethods: ['GET', 'POST'],
    },
    routes: {
      'GET /samples': `${BACKEND_PATH}/lambda.getSamples`,
      'GET /samples/{id}': `${BACKEND_PATH}/lambda.getSample`,
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return { api };
}
