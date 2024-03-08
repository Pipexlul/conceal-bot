import { Command } from "@sapphire/framework";

import { ElevenLabsService } from "../services";

import path from "path";
import {
  NoSubscriberBehavior,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  joinVoiceChannel,
} from "@discordjs/voice";
import { isGuildMember } from "@sapphire/discord.js-utilities";
import envVars from "../config/env";
import { serverIds } from "../utils/envUtils";

const player = createAudioPlayer({
  behaviors: {
    noSubscriber: NoSubscriberBehavior.Pause,
  },
});

const testResource = createAudioResource(
  path.join(__dirname, "../../audio/rosh_jawa.mp3"),
  { inlineVolume: true }
);

class TTSTest extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: "ttstest",
      description: "test tts functions",
      preconditions: ["NotNate"],
    });
  }

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
    const defered = await interaction.deferReply({ fetchReply: true });

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

    let connection = getVoiceConnection(guild.id);

    const message = "";

    if (!connection) {
      connection = joinVoiceChannel({
        guildId: guild.id,
        channelId: member.voice.channelId,
        adapterCreator: guild.voiceAdapterCreator,
      });

      // message = `Joined ${member.voice.channel?.name}!`;
    } else {
      // connection.destroy();
      // message = `Left ${member.voice.channel?.name}, bye bye (loser)`;
    }

    connection.subscribe(player);

    const tts = await ElevenLabsService.generate({
      stream: true,
      text: interaction.options.getString("message") ?? "",
      model_id: "eleven_multilingual_v2",
      voice: interaction.options.getString("voice") ?? "Matthew",
    });

    const ttsResource = createAudioResource(tts, { inlineVolume: true });
    const volume = interaction.options.getNumber("volume") ?? 1;

    ttsResource.volume?.setVolume(volume);

    if (message) {
      await interaction.editReply({
        content: `${message}\n\nFriendly reminder that this command cannot be used by Nate!`,
      });
    } else {
      await interaction.editReply({
        content: "Playing...",
      });
    }

    player.play(ttsResource);
  }
}

export { TTSTest };
