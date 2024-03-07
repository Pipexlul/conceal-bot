import { Command } from "@sapphire/framework";

import { ElevenLabsService } from "../services";

import envVars from "../config/env";
import { serverIds } from "../utils/envUtils";

const {
  apiKeys: { elevenlabs },
} = envVars;

class ELabsTestCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: "apitest",
      description: "test api call",
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) => builder.setName(this.name).setDescription(this.description),
      {
        guildIds: serverIds,
      }
    );
  }

  public override async chatInputRun(
    interaction: Command.ChatInputCommandInteraction
  ) {
    await interaction.deferReply();

    const result = await ElevenLabsService.voices.getAll();

    const data = result.voices.slice(0, 3);

    return interaction.editReply({
      content: JSON.stringify(data, null, 2).slice(0, 2000),
    });
  }
}

export { ELabsTestCommand };
