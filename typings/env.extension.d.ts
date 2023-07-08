declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    DISCORD_BOT_TOKEN: string;
    ELEVENLABS_API_KEY: string;
    INWORLD_API_KEY: string;
  }
}
