declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV?: string;
    readonly PORT?: string;

    readonly DISCORD_BOT_TOKEN?: string;
    readonly TEST_SERVER_ID?: string;

    readonly ELEVENLABS_API_KEY?: string;
    readonly INWORLD_API_KEY?: string;
  }
}
