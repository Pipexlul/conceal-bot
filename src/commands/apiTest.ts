import { Command } from "@sapphire/framework";

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
        // idHints: ["1144162080845467730"],
      }
    );
  }

  public override async chatInputRun(
    interaction: Command.ChatInputCommandInteraction
  ) {
    await interaction.deferReply();

    return interaction.editReply({
      content: "lol",
    });
  }
}

export { ELabsTestCommand };
