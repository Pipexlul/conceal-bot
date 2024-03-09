import { Command } from "@sapphire/framework";

import { serverIds } from "../utils/envUtils";

class ShutdownCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: "shutdown",
      description: "Shuts down the bot (owners only)",
      preconditions: ["OwnersOnly"],
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
    await interaction.reply({
      ephemeral: true,
      content: "Shutting down...",
    });

    console.log("Bot client shutting down...");

    await this.container.client.destroy();

    process.exit(0);
  }
}

export { ShutdownCommand };
