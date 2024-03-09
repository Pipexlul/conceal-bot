import { Time } from "@sapphire/time-utilities";

import envConfig from "./env";

interface IGlobalConfig {
  [cmdCategory: string]: {
    cooldown: number;
    filtered?: string[];
  };
}

const { conceal } = envConfig;

const ms = (seconds: number) => Time.Second * seconds;

const globalConfig = {
  tts: {
    cooldown: ms(15),
    filtered: [conceal.jace],
  },
  ttsMeta: {
    cooldown: ms(5),
    filtered: [conceal.jace, conceal.pipex],
  },
  ping: {
    cooldown: ms(5),
  },
} satisfies IGlobalConfig;

export default globalConfig;
