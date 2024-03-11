import { ApplyOptions } from "@sapphire/decorators";
import { isMessageInstance } from "@sapphire/discord.js-utilities";
import { Command } from "@sapphire/framework";

import { serverIds } from "../utils/envUtils";

import { cooldownConfig as config } from "../config/globals";

@ApplyOptions<Command.Options>({
  name: "Ping",
  description: "Check epic ping connection",
  aliases: ["pong", "enemybastion"],
  cooldownDelay: config.ping.cooldown,
})
class PingCommand extends Command {
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
    const msg = await interaction.reply({
      content: "Pinging...",
      fetchReply: true,
    });

    if (isMessageInstance(msg)) {
      const diff = msg.createdTimestamp - interaction.createdTimestamp;
      return interaction.editReply(
        `Pong: Round trip took: ${diff} milliseconds`
      );
    }

    return interaction.editReply("Ping message could not be fetched :(");
  }
}

export { PingCommand };
