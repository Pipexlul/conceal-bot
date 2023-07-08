import { ActivityType } from "discord.js";
import { SapphireClient } from "@sapphire/framework";

import { botToken } from "./config/envConfig";

const main = async () => {
  const client = new SapphireClient({
    intents: [
      "GuildMessages",
      "GuildMembers",
      "GuildVoiceStates",
      "MessageContent",
    ],
    presence: {
      status: "online",
      activities: [{ type: ActivityType.Playing, name: "with a spoon" }],
    },
  });

  const terminateHandler = () => {
    if (client.token !== null) {
      console.log("Shutting down...");
      client.destroy();
    }
  };

  process.on("SIGKILL", terminateHandler);
  process.on("SIGTERM", terminateHandler);
  process.on("SIGINT", terminateHandler);
  process.on("exit", terminateHandler);

  const terminateEvents: string[] = ["SIGKILL", "SIGTERM", "SIGINT", "exit"];

  terminateEvents.forEach((ev) => {
    process.on(ev, terminateHandler);
  });

  client.once("ready", () => {
    console.log(`${client.user?.tag} is ready!`);
  });

  await client.login(botToken);
};

main();
