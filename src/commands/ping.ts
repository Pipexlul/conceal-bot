import { Command } from "@sapphire/framework";
import { isMessageInstance } from "@sapphire/discord.js-utilities";

import { getServerIds } from "../utils/envUtils";

export class PingCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: "Ping",
      description: "Check epic ping connection",
      aliases: ["pong", "enemybastion"]
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) => builder.setName(this.name).setDescription(this.description),
      {
        guildIds: getServerIds()
      }
    );
  }

  public override async chatInputRun(
    interaction: Command.ChatInputCommandInteraction
  ) {
    const msg = await interaction.reply({
      content: "Pinging...",
      fetchReply: true
    });

    if (isMessageInstance(msg)) {
      const diff = msg.createdTimestamp - interaction.createdTimestamp;
      const ping = Math.round(this.container.client.ws.ping);
      return interaction.editReply(
        `Pong: Round trip took: ${diff} milliseconds. Actual ping is: ${ping} milliseconds`
      );
    }

    return interaction.editReply("Ping message could not be fetched :(");
  }
}
