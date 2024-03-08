import { ElevenLabsClient } from "elevenlabs";

import envVars from "../../config/env";
const {
  apiKeys: { elevenlabs },
} = envVars;

const eLabsClient = new ElevenLabsClient({
  apiKey: elevenlabs,
});

export { eLabsClient };
