declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV?: string;
    readonly PORT?: string;

    readonly OWNER_ID?: string;

    readonly DISCORD_BOT_TOKEN?: string;
    readonly REAL_SERVER_ID?: string;
    readonly TEST_SERVER_ID?: string;

    readonly ELEVENLABS_API_KEY?: string;
    readonly INWORLD_API_KEY?: string;

    readonly JACE_ID?: string;
    readonly PIPEX_ID?: string;
    readonly SWIZZ_ID?: string;
  }
}
