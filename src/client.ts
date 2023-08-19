import ConcealClient from "./classes/ConcealClient";

import { intents } from "./config/gatewayIntents";

const client = new ConcealClient({
  intents: intents,
  loadMessageCommandListeners: true
});

export default client;
