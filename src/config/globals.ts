import { Time } from "@sapphire/time-utilities";

import envConfig from "./env";

interface ICooldownConfig {
  [cmdCategory: string]: {
    cooldown: number;
    filtered?: string[];
  };
}

const { conceal } = envConfig;

const ms = (seconds: number) => Time.Second * seconds;

const cooldownConfig = {
  tts: {
    cooldown: ms(15),
    filtered: [conceal.jace],
  },
  ttsMeta: {
    cooldown: ms(5),
    filtered: [conceal.jace, conceal.pipex],
  },
  inworld: {
    cooldown: ms(2),
  },
  ping: {
    cooldown: ms(5),
  },
} satisfies ICooldownConfig;

const globalConfig = {
  inworld: {
    workspace: "conceal",
  },
};

export { globalConfig, cooldownConfig };
