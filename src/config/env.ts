import dotenv from "dotenv";
dotenv.config();

import { EnvTypesArr } from "../types/env";
import type { EnvType } from "../types/env";

const {
  NODE_ENV,
  PORT,
  DISCORD_BOT_TOKEN,
  TEST_SERVER_ID,
  ELEVENLABS_API_KEY,
  INWORLD_API_KEY
} = process.env;

const isValid = (value?: string): value is string =>
  value !== undefined && value !== null && value !== "";

const isValidEnvironment = (value?: string): value is EnvType => {
  return isValid(value) && EnvTypesArr.includes(value as EnvType);
};

const numPort = isValid(PORT) ? parseInt(PORT) : NaN;

if (!isValid(DISCORD_BOT_TOKEN)) {
  throw new Error("DISCORD_BOT_TOKEN is required");
}

const config = {
  node_env: isValidEnvironment(NODE_ENV) ? NODE_ENV : "development",
  port: !isNaN(numPort) ? numPort : 3000,
  discordToken: DISCORD_BOT_TOKEN,
  testServerId: isValid(TEST_SERVER_ID) ? TEST_SERVER_ID : "",
  apiKeys: {
    elevenlabs: isValid(ELEVENLABS_API_KEY) ? ELEVENLABS_API_KEY : "",
    inworld: isValid(INWORLD_API_KEY) ? INWORLD_API_KEY : ""
  }
};

export default config;
