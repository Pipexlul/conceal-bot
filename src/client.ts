import { SapphireClient } from "@sapphire/framework";

import { intents } from "./config/gatewayIntents";

const client = new SapphireClient({
  intents: intents,
  loadMessageCommandListeners: true
});

export default client;
