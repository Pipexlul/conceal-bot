import "dotenv/config";

import { EnvTypesArr } from "../types/env";
import type { EnvType } from "../types/env";

const {
  NODE_ENV,
  PORT,
  PIPEX_ID,
  JACE_ID,
  SWIZZ_ID,
  NATE_ID,
  MELLOW_ID,
  MIGUEL_ID,
  DISCORD_BOT_TOKEN,
  REAL_SERVER_ID,
  TEST_SERVER_ID,
  ELEVENLABS_API_KEY,
  INWORLD_API_KEY,
  INWORLD_API_SECRET,
  INWORLD_API_STUDIO_BASE64,
  DEBUG_MODE,
} = process.env;

const isValid = (value?: string): value is string =>
  value !== undefined && value !== null && value !== "";

const isValidEnvironment = (value?: string): value is EnvType => {
  return isValid(value) && EnvTypesArr.includes(value as EnvType);
};

const isValidEnvironmentBoolean = (value?: string): boolean => {
  const lcVal = value?.toLowerCase();

  if (lcVal === "true" || lcVal === "false") {
    return true;
  }

  console.warn("Tried to parse env value as boolean but failed: ", value);

  return false;
};

const numPort = isValid(PORT) ? parseInt(PORT) : NaN;

if (!isValid(DISCORD_BOT_TOKEN)) {
  throw new Error("DISCORD_BOT_TOKEN is required");
}

const config = {
  node_env: isValidEnvironment(NODE_ENV) ? NODE_ENV : "development",
  port: !Number.isNaN(numPort) ? numPort : 3000,
  conceal: {
    pipex: isValid(PIPEX_ID) ? PIPEX_ID : "",
    jace: isValid(JACE_ID) ? JACE_ID : "",
    swizz: isValid(SWIZZ_ID) ? SWIZZ_ID : "",
    nate: isValid(NATE_ID) ? NATE_ID : "",
    mellow: isValid(MELLOW_ID) ? MELLOW_ID : "",
    miguel: isValid(MIGUEL_ID) ? MIGUEL_ID : "",
  },
  discordToken: DISCORD_BOT_TOKEN,
  realServerId: isValid(REAL_SERVER_ID) ? REAL_SERVER_ID : "",
  testServerId: isValid(TEST_SERVER_ID) ? TEST_SERVER_ID : "",
  apiKeys: {
    elevenlabs: isValid(ELEVENLABS_API_KEY) ? ELEVENLABS_API_KEY : "",
    inworld: {
      key: isValid(INWORLD_API_KEY) ? INWORLD_API_KEY : "",
      secret: isValid(INWORLD_API_SECRET) ? INWORLD_API_SECRET : "",
      studio: isValid(INWORLD_API_STUDIO_BASE64)
        ? INWORLD_API_STUDIO_BASE64
        : "",
    },
  },
  isDebug: isValidEnvironmentBoolean(DEBUG_MODE)
    ? DEBUG_MODE === "true"
    : false,
};

export default config;
