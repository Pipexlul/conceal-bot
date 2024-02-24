import { GatewayIntentBits } from "discord.js";

const intents =
  GatewayIntentBits.Guilds |
  GatewayIntentBits.GuildMembers |
  GatewayIntentBits.GuildMessages |
  GatewayIntentBits.GuildMessageReactions |
  GatewayIntentBits.GuildVoiceStates |
  GatewayIntentBits.MessageContent;

export { intents };
