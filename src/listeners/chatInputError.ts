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
    let message = error.message;

    if (error.identifier === "preconditionCooldown") {
      const cooldownContext = error.context as {
        remaining: number;
      };

      const formattedSeconds = (cooldownContext.remaining / 1000).toFixed(1);

      message = `You're on cooldown. Please wait ${formattedSeconds} seconds before trying again.`;
    }

    const { interaction } = payload;

    if (interaction.deferred || interaction.replied) {
      return interaction.editReply({
        content: message,
      });
    }

    return interaction.reply({
      content: message,
      ephemeral: true,
    });
  }
}

export { ChatInputError };
