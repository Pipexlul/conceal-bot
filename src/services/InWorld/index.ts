import {
  InworldClient,
  InworldConnectionService,
  InworldPacket,
} from "@inworld/nodejs-sdk";
import { inWorldAxios } from "./axios";

type InworldConnection = InworldConnectionService<InworldPacket>;

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

import { Command } from "@sapphire/framework";
import { globalConfig } from "../../config/globals";

const iwWorkspace = globalConfig.inworld.workspace;

class InWorldService {
  private clientsMap: Map<string, InworldConnection>;
  private interactionReplies: Map<string, string[]>;
  private characters: ICharacter[];

  constructor() {
    this.clientsMap = new Map();
    this.characters = [];
    this.interactionReplies = new Map();

    this.getCharacters().then((characters) => {
      if (characters) {
        this.characters = characters;
      }
    });
  }

  private generateMapId = (user: IDiscordUser, characterId: string) =>
    `${user.id}-${characterId}`;

  // TODO: FG: Use a map for faster lookup
  private getCharacterName = (characterId: string) => {
    const character = this.characters.find((char) => char.id === characterId);

    return character?.name;
  };

  public async getCharacters() {
    try {
      const res = await inWorldAxios.get(
        `/workspaces/${iwWorkspace}/characters`
      );

      const characters = (res.data.characters as TODO[]).map((char) => ({
        id: char.name,
        name: char.defaultCharacterDescription.givenName,
      }));

      return characters;
    } catch (err) {
      console.error("GETCHARACTERS ERROR");
      console.error(err);
      return null;
    }
  }

  public async talkToCharacter(
    user: IDiscordUser,
    characterId: string,
    message: string,
    interaction: Command.ChatInputCommandInteraction
  ): Promise<InworldPacket | string> {
    const mapId = this.generateMapId(user, characterId);

    const characterName = this.getCharacterName(characterId);

    if (!this.clientsMap.has(mapId)) {
      const client = new InworldClient()
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
        })
        .setOnMessage((packet) => {
          const logData = {
            packetId: packet.packetId,
            isEnd: packet.isInteractionEnd(),
            isText: packet.isText(),
            source: packet.routing.source.isPlayer ? "PLAYER" : "CHARACTER",
            target: packet.routing.target.isPlayer ? "PLAYER" : "CHARACTER",
            text: packet.isText() ? packet.text : null,
          };

          console.log("INWORLD MESSAGE");
          console.log(logData);

          if (interaction.deferred) {
            if (
              (packet.routing.source.isCharacter &&
                packet.routing.target.isPlayer &&
                packet.isText()) ||
              packet.isInteractionEnd()
            ) {
              if (!this.interactionReplies.has(packet.packetId.interactionId)) {
                this.interactionReplies.set(packet.packetId.interactionId, []);
              }

              const replies = this.interactionReplies.get(
                packet.packetId.interactionId
              );

              if (!replies) {
                throw new Error("No replies found");
              }

              let characterResponse = "";
              if (!packet.isInteractionEnd()) {
                replies.push(packet.text.text);
              } else {
                characterResponse = replies.join("\n");
                this.interactionReplies.delete(packet.packetId.interactionId);

                const reply = `${interaction.user.displayName}: ${message}\n\n${characterName}: ${characterResponse}`;

                const clientConnection = this.clientsMap.get(mapId);

                if (clientConnection) {
                }

                interaction.editReply({
                  content: reply,
                });
              }
            }
          }
        });

      const connection = client.build();

      this.clientsMap.set(mapId, connection);
    }

    const clientData = this.clientsMap.get(mapId);

    if (!clientData) {
      return "No client found";
    }

    return await clientData.sendText(message);
  }
}

const inworldService = new InWorldService();

export { inworldService };
export type { IDiscordUser };
