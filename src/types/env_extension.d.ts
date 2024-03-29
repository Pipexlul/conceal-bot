declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV?: string;
    readonly PORT?: string;

    readonly DISCORD_BOT_TOKEN?: string;
    readonly REAL_SERVER_ID?: string;
    readonly TEST_SERVER_ID?: string;

    readonly ELEVENLABS_API_KEY?: string;
    readonly INWORLD_API_KEY?: string;
    readonly INWORLD_API_SECRET?: string;
    readonly INWORLD_API_STUDIO_BASE64?: string;

    readonly JACE_ID?: string;
    readonly PIPEX_ID?: string;
    readonly SWIZZ_ID?: string;
    readonly NATE_ID?: string;
    readonly MELLOW_ID?: string;
    readonly MIGUEL_ID?: string;

    readonly DEBUG_MODE?: string;
  }
}
