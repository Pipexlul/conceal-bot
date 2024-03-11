import { ApplyOptions } from "@sapphire/decorators";
import { BucketScope, Command } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";

import { cooldownConfig as config } from "../config/globals";
import { ElevenLabsService } from "../services";
import { serverIds } from "../utils/envUtils";

@ApplyOptions<Command.Options>({
  name: "tts-info",
  description: "Prints info about ElevenLabs service",
  preconditions: ["OwnersOnly"],
  cooldownDelay: config.ttsMeta.cooldown,
  cooldownFilteredUsers: config.ttsMeta.filtered,
})
class TTSInfoCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder //
          .setName(this.name)
          .setDescription(this.description),
      {
        guildIds: serverIds,
      }
    );
  }

  public override async chatInputRun(
    interaction: Command.ChatInputCommandInteraction
  ) {
    await interaction.deferReply({
      ephemeral: true,
    });

    const res = await ElevenLabsService.user.getSubscription();

    const { character_count: cur, character_limit } = res;

    const max = character_limit ? character_limit : 1;

    await interaction.editReply({
      content: `You have used ${cur} characters out of ${max} (${Math.round(
        (cur / max) * 100
      )}%)`,
    });
  }
}

export { TTSInfoCommand };
