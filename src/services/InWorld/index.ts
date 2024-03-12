import {
  InworldClient,
  InworldConnectionService,
  InworldPacket,
  ServiceError,
} from "@inworld/nodejs-sdk";
import { inWorldAxios } from "./axios";

interface IDiscordUser {
  id: string;
  name: string;
}

interface ICharacter {
  id: string;
  name: string;
}

import envConfig from "../../config/env";
const {
  apiKeys: { inworld },
} = envConfig;

import { globalConfig } from "../../config/globals";

const iwWorkspace = globalConfig.inworld.workspace;

class InWorldCharacters {
  private _cachedCharacters: ICharacter[] | null = null;

  public async charIdToName(charId: string) {
    const defaultName = "Character";

    const characters = await this.getCharacters();

    if (!characters) {
      return defaultName;
    }

    const character = characters.find((char) => char.id === charId);

    return character?.name ?? defaultName;
  }

  public async getCharacters() {
    if (this._cachedCharacters) {
      return this._cachedCharacters;
    }

    try {
      const res = await inWorldAxios.get(
        `/workspaces/${iwWorkspace}/characters`
      );

      const characters: ICharacter[] = (res.data.characters as TODO[]).map(
        (char) => ({
          id: char.name,
          name: char.defaultCharacterDescription.givenName,
        })
      );

      this._cachedCharacters = characters;

      return characters;
    } catch (err) {
      console.error("LOADCHARACTERS ERROR");
      console.error(err);

      return null;
    }
  }
}

class InWorldService {
  private interactionReplies: Map<string, string[]> = new Map();

  public async talkToCharacter(
    user: IDiscordUser,
    characterId: string,
    messageHandler: (
      fullMessage: string | null,
      err: ServiceError | null
    ) => void
  ) {
    const connection = new InworldClient()
      .setApiKey({
        key: inworld.key,
        secret: inworld.secret,
      })
      .setConfiguration({
        capabilities: {
          audio: false,
        },
      })
      .setUser({
        fullName: user.name,
      })
      .setScene(characterId)
      .setOnError((err) => {
        console.error(err); // TODO: FG: Improve error handling

        messageHandler(null, err);
      })
      .setOnMessage((packet) => {
        const interactionId = packet.packetId.interactionId;

        let replies = this.interactionReplies.get(interactionId);

        if (!replies) {
          replies = [];
          this.interactionReplies.set(interactionId, replies);
        }

        if (packet.isInteractionEnd()) {
          messageHandler(replies.join("\n\n"), null);
          this.interactionReplies.delete(interactionId);

          return;
        }

        if (packet.isText()) {
          replies.push(packet.text.text);
        }
      })
      .build();

    return connection.sendText.bind(connection);
  }
}

const inworldCharacters = new InWorldCharacters();
const inworldService = new InWorldService();

export { inworldService, inworldCharacters };
export type { IDiscordUser };
