declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly PORT: string;

    readonly ELEVENLABS_API_KEY: string;
    readonly INWORLD_API_KEY: string;
  }
}
