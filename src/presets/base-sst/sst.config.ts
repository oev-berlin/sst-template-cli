import { SSTConfig } from 'sst';
import { ApiStack } from './stacks/ApiStack';
import { WebStack } from './stacks/WebStack';

export default {
  config({ region = 'eu-cemtral-1', stage, ...config }) {
    return {
      name: '<app-name>',
      region,
      stage,
      ...config,
    };
  },
  stacks(app) {
    app.stack(ApiStack).stack(WebStack);
  },
} satisfies SSTConfig;
