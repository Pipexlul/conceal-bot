import { ActivityType } from "discord.js";

import envConfig from "./config/env";
const { discordToken } = envConfig;

import concealClient from "./client";
import { applyExitHandlers } from "./utils/appExitHandler";

import {
  ApplicationCommandRegistries,
  RegisterBehavior,
} from "@sapphire/framework";
import { isDev } from "./utils/envUtils";

const main = async () => {
  try {
    concealClient.once("ready", () => {
      console.log(`Logged in as ${concealClient.user?.tag}!`);
    });

    applyExitHandlers(concealClient);

    await concealClient.login(discordToken);

    ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(
      RegisterBehavior.BulkOverwrite
    );

    concealClient.user?.setPresence({
      status: "online",
      activities: [
        {
          name: `Ultrakill Act 3 ${isDev ? "Devrun" : "Speedrun"}`,
          type: ActivityType.Competing,
        },
      ],
    });
  } catch (err) {
    console.error(err);
  }
};

main();
