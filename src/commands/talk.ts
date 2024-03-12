import {
  createAudioResource,
  getVoiceConnection,
  joinVoiceChannel,
} from "@discordjs/voice";
import { ServiceError } from "@inworld/nodejs-sdk";
import { ApplyOptions } from "@sapphire/decorators";
import { isGuildMember } from "@sapphire/discord.js-utilities";
import { Command } from "@sapphire/framework";
import { cooldownConfig } from "../config/globals";
import { ElevenLabsService, VoiceService } from "../services";
import {
  type IDiscordUser,
  inworldCharacters,
  inworldService,
} from "../services/InWorld";
import { linkerService } from "../services/Linker";
import { serverIds } from "../utils/envUtils";

@ApplyOptions<Command.Options>({
  name: "talk",
  description: "Talk to a character and hear their response.",
  preconditions: [],
  cooldownDelay: cooldownConfig.talk.cooldown,
})
class TalkCommand extends Command {
  private extractUser = (
    interaction: Command.ChatInputCommandInteraction
  ): IDiscordUser => {
    return {
      id: interaction.user.id,
      name: interaction.user.displayName,
    };
  };

  public override async registerApplicationCommands(
    registry: Command.Registry
  ) {
    const charactersRes = await inworldCharacters.getCharacters();

    const charNames =
      charactersRes?.map((char) => ({
        name: char.name,
        value: char.id,
      })) ?? [];

    registry.registerChatInputCommand(
      (builder) =>
        builder //
          .setName(this.name)
          .setDescription(this.description)
          .addStringOption((option) =>
            option
              .setName("character")
              .setDescription("Character to talk to")
              .setRequired(true)
              .addChoices(...charNames)
          )
          .addStringOption((option) =>
            option
              .setName("message")
              .setDescription("Message to send")
              .setRequired(true)
              .setMinLength(1)
              .setMaxLength(255)
          ),
      {
        guildIds: serverIds,
      }
    );
  }

  public override async chatInputRun(
    interaction: Command.ChatInputCommandInteraction
  ) {
    const user = this.extractUser(interaction);

    const guild = interaction.guild;
    const member = interaction.member;

    if (
      guild === null ||
      member === null ||
      !isGuildMember(member) ||
      member.voice.channelId === null
    ) {
      await interaction.reply({
        content: "You must be in a voice channel to use this command.",
      });
      return;
    }

    if (VoiceService.state.busy) {
      await interaction.reply({
        content: `I'm busy right now, ${user.name}, please wait a moment!`,
      });

      return;
    }

    const processingReply = await interaction.reply({
      fetchReply: true,
      content: "Processing...",
    });

    const char = interaction.options.getString("character", true);
    const message = interaction.options.getString("message", true);
    const prettyName = await inworldCharacters.charIdToName(char);

    const voiceId = linkerService.getElevenLabsId(char);

    const reply = await processingReply.edit({
      content: `${user.name} to ${prettyName}:\n\n${message}`,
    });

    const msgHandler = async (
      fullMessage: string | null,
      err: ServiceError | null
    ) => {
      if (err) {
        await reply.reply({
          content: `Error talking to ${prettyName}: ${err.message}`,
        });

        return;
      }

      if (!fullMessage) {
        await reply.reply({
          content: `${prettyName} didn't respond.`,
        });

        return;
      }

      VoiceService.state.setBusy(true);

      let connection = getVoiceConnection(guild.id);

      if (
        member.voice.channelId &&
        (!connection ||
          connection.joinConfig.channelId !== member.voice.channelId)
      ) {
        connection = joinVoiceChannel({
          guildId: guild.id,
          channelId: member.voice.channelId,
          adapterCreator: guild.voiceAdapterCreator,
        });

        VoiceService.state.subscribeToConnection(connection);
      }

      const tts = await ElevenLabsService.generate({
        stream: true,
        text: fullMessage,
        model_id: "eleven_multilingual_v2",
        voice: voiceId,
      });

      const ttsResource = createAudioResource(tts, { inlineVolume: true });

      const volume = interaction.options.getNumber("volume") ?? 1;

      ttsResource.volume?.setVolume(volume);

      const characterReply = await reply.reply({
        content: `${prettyName} replied: ${fullMessage}`,
      });

      VoiceService.state.audioPlayer.play(ttsResource);
    };

    const sendText = await inworldService.talkToCharacter(
      user,
      char,
      msgHandler
    );

    await sendText(message);
  }
}

export { TalkCommand };
