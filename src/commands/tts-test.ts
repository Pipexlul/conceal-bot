import { ApplyOptions } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";

import config from "../config/globals";
import { ElevenLabsService, VoiceService } from "../services";

import {
  createAudioResource,
  getVoiceConnection,
  joinVoiceChannel,
} from "@discordjs/voice";
import { isGuildMember } from "@sapphire/discord.js-utilities";
import { serverIds } from "../utils/envUtils";

@ApplyOptions<Command.Options>({
  name: "tts",
  description: "test tts functions",
  cooldownDelay: config.tts.cooldown,
  cooldownFilteredUsers: config.tts.filtered,
})
class TTSTest extends Command {
  public override async registerApplicationCommands(
    registry: Command.Registry
  ) {
    const res = await ElevenLabsService.voices.getAll();
    const {
      subscription: { status: userStatus },
    } = await ElevenLabsService.user.get();

    const isPaidUser = userStatus === "active";

    const voices = res.voices
      .filter((v) => {
        const voiceCategory = v.category;

        if (isPaidUser) {
          return true;
        }

        return voiceCategory === "premade";
      })
      .map((v) => {
        return {
          value: v.voice_id,
          name: v.name,
          category: v.category,
        };
      })
      .sort((a, b) => {
        const categoryA = a.category;
        const categoryB = b.category;

        if (categoryA === categoryB) {
          return a.name.localeCompare(b.name);
        }

        if (categoryA === "cloned") {
          return -1;
        }

        if (categoryB === "cloned") {
          return 1;
        }

        if (categoryA === "premade") {
          return 1;
        }

        if (categoryB === "premade") {
          return -1;
        }

        return a.name.localeCompare(b.name);
      })
      .slice(0, 25);

    console.log(voices);

    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addStringOption((option) =>
            option
              .setName("voice")
              .setDescription("Name of the voice to use")
              .setRequired(true)
              .addChoices(...voices)
          )
          .addStringOption((option) =>
            option
              .setName("message")
              .setDescription("The message to say")
              .setRequired(true)
          )
          .addNumberOption((option) =>
            option
              .setName("volume")
              .setDescription("Volume as a decimal from 0 to 2")
              .setMinValue(0)
              .setMaxValue(2)
              .setRequired(false)
          ),
      {
        guildIds: serverIds,
      }
    );
  }

  public override async chatInputRun(
    interaction: Command.ChatInputCommandInteraction
  ) {
    await interaction.deferReply({ ephemeral: true });

    const guild = interaction.guild;
    const member = interaction.member;

    if (
      guild === null ||
      member === null ||
      !isGuildMember(member) ||
      member.voice.channelId === null
    ) {
      // TODO: FG: Error handling?
      return;
    }

    if (VoiceService.state.busy) {
      await interaction.editReply({
        content: `I'm already processing a request or playing a sound ${member.displayName}, please wait a moment!`,
      });

      return;
    }

    VoiceService.state.setBusy(true);

    let connection = getVoiceConnection(guild.id);

    if (!connection) {
      connection = joinVoiceChannel({
        guildId: guild.id,
        channelId: member.voice.channelId,
        adapterCreator: guild.voiceAdapterCreator,
      });

      VoiceService.state.subscribeToConnection(connection);
    }

    const tts = await ElevenLabsService.generate({
      stream: true,
      text: interaction.options.getString("message") ?? "",
      model_id: "eleven_multilingual_v2",
      voice: interaction.options.getString("voice") ?? "Matthew",
    });

    const ttsResource = createAudioResource(tts, { inlineVolume: true });
    const volume = interaction.options.getNumber("volume") ?? 1;

    ttsResource.volume?.setVolume(volume);

    await interaction.editReply({
      content: "Playing TTS...",
    });

    VoiceService.state.audioPlayer.play(ttsResource);
  }
}

export { TTSTest };
