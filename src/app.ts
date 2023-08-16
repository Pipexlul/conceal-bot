import { ActivityType } from "discord.js";

import envConfig from "./config/env";
const { discordToken, node_env } = envConfig;

import saphClient from "./client";

const isDev = node_env === "development";

const main = async () => {
  try {
    saphClient.once("ready", () => {
      console.log(`Logged in as ${saphClient.user!.tag}!`);
    });

    await saphClient.login(discordToken);

    saphClient.user?.setPresence({
      status: "online",
      activities: [
        {
          name: `Ultrakill Act 3 ${isDev ? "Devrun" : "Speedrun"}`,
          type: ActivityType.Competing
        }
      ]
    });
  } catch (err) {
    console.error(err);
  }
};

main();
