import { ApplyOptions } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";

import { ServiceError } from "@inworld/nodejs-sdk";
import { cooldownConfig } from "../config/globals";
import {
  IDiscordUser,
  inworldCharacters,
  inworldService,
} from "../services/InWorld";
import { serverIds } from "../utils/envUtils";

@ApplyOptions<Command.Options>({
  name: "iw-test",
  description: "Test command for InWorld API",
  cooldownDelay: cooldownConfig.inworld.cooldown,
  preconditions: [],
})
class IWTestCommand extends Command {
  private extractUser = (
    interaction: Command.ChatInputCommandInteraction
  ): IDiscordUser => {
    return {
      id: interaction.user.id,
      name: interaction.user.displayName,
    };
  };

  public override async registerApplicationCommands(
    registry: Command.Registry
  ) {
    const charactersRes = await inworldCharacters.getCharacters();

    const charNames =
      charactersRes?.map((char) => ({
        name: char.name,
        value: char.id,
      })) ?? [];

    registry.registerChatInputCommand(
      (builder) =>
        builder //
          .setName(this.name)
          .setDescription(this.description)
          .addStringOption((option) =>
            option
              .setName("character")
              .setDescription("Character to talk to")
              .setRequired(true)
              .addChoices(...charNames)
          )
          .addStringOption((option) =>
            option
              .setName("message")
              .setDescription("Message to send")
              .setRequired(true)
              .setMinLength(1)
              .setMaxLength(255)
          ),
      {
        guildIds: serverIds,
      }
    );
  }

  public override async chatInputRun(
    interaction: Command.ChatInputCommandInteraction
  ) {
    const user = this.extractUser(interaction);

    const char = interaction.options.getString("character", true);
    const prettyName = await inworldCharacters.charIdToName(char);
    const message = interaction.options.getString("message", true);

    const reply = await interaction.reply({
      fetchReply: true,
      content: `${interaction.user.displayName} message to ${prettyName}:\n\n${message}`,
    });

    const msgHandler = async (
      fullMessage: string | null,
      err: ServiceError | null
    ) => {
      if (err) {
        await reply.reply({
          content: `Error: ${err.message}`,
        });

        return;
      }

      await reply.reply({
        content: `${prettyName} replied: ${fullMessage}`,
      });
    };

    const sendText = await inworldService.talkToCharacter(
      user,
      char,
      msgHandler
    );

    await sendText(message);
  }
}

export { IWTestCommand };
