import dotenv from "dotenv";
dotenv.config();

import { z } from "zod";

const nonEmptyStringSchema = z.string().nonempty();

const { DISCORD_BOT_TOKEN, ELEVENLABS_API_KEY, INWORLD_API_KEY, NODE_ENV } =
  process.env;

const stringsToValidate = {
  DISCORD_BOT_TOKEN,
  // ELEVENLABS_API_KEY,
  // INWORLD_API_KEY,
};

Object.entries(stringsToValidate).forEach(([key, str]) => {
  const result = nonEmptyStringSchema.safeParse(str);

  if (!result.success) {
    throw new Error(`"${key}" is either missing in env or is an empty string`);
  }
});

export {
  DISCORD_BOT_TOKEN as botToken,
  ELEVENLABS_API_KEY as elevenlabsApiKey,
  INWORLD_API_KEY as inworldApiKey,
  NODE_ENV as env,
};
