import { Command } from "@sapphire/framework";

import { getServerIds } from "../utils/envUtils";

export class ShutdownCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: "shutdown",
      description: "Shuts down the bot (owner only)",
      preconditions: ["OwnerOnly"],
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) => builder.setName(this.name).setDescription(this.description),
      {
        guildIds: getServerIds(),
        idHints: ["1144162080845467730"],
      }
    );
  }

  public override async chatInputRun(
    interaction: Command.ChatInputCommandInteraction
  ) {
    await interaction.reply("Shutting bot down...");
    await this.container.client.destroy();

    process.exit(0);
  }
}
