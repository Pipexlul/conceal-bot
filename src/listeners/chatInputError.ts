import {
  type ChatInputCommandDeniedPayload,
  Events,
  Listener,
  type UserError,
} from "@sapphire/framework";

class ChatInputError extends Listener<typeof Events.ChatInputCommandDenied> {
  public constructor(
    context: Listener.LoaderContext,
    options: Listener.Options
  ) {
    super(context, {
      ...options,
      event: Events.ChatInputCommandDenied,
      name: "ChatInputError",
    });
  }

  public run(error: UserError, payload: ChatInputCommandDeniedPayload) {
    const { interaction } = payload;

    if (interaction.deferred || interaction.replied) {
      return interaction.editReply({
        content: error.message,
      });
    }

    return interaction.reply({
      content: error.message,
      ephemeral: true,
    });
  }
}

export { ChatInputError };
