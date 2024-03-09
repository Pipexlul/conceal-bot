import { ApplyOptions } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";
import { ElevenLabsService } from "../services";

@ApplyOptions<Command.Options>({
  name: "tts-info",
  description: "Prints info about ElevenLabs service",
  preconditions: ["OwnersOnly"],
})
class TestCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder //
        .setName(this.name)
        .setDescription(this.description)
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

export { TestCommand };
