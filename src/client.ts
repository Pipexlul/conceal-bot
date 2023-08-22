import { LogLevel } from "@sapphire/framework";
import ConcealClient from "./classes/ConcealClient";

import { intents } from "./config/gatewayIntents";

const client = new ConcealClient({
  intents: intents,
  loadMessageCommandListeners: true,
  logger: {
    level: LogLevel.Debug
  }
});

export default client;
