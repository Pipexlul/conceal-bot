import { GatewayIntentBits } from "discord.js";

export const intents =
  GatewayIntentBits.Guilds |
  GatewayIntentBits.GuildMembers |
  GatewayIntentBits.GuildMessages |
  GatewayIntentBits.GuildMessageReactions |
  GatewayIntentBits.GuildVoiceStates |
  GatewayIntentBits.MessageContent;
