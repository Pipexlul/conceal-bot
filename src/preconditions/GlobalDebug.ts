import { AllFlowsPrecondition } from "@sapphire/framework";
import type {
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
  Message,
} from "discord.js";

import envVars from "../config/env";
const {
  conceal: { pipex, jace },
  isDebug,
} = envVars;

const debugUsers = [pipex, jace];

class GlobalDebug extends AllFlowsPrecondition {
  private message = "The app is currently in debug-only mode. Sorry!";

  public constructor(
    context: AllFlowsPrecondition.LoaderContext,
    options: AllFlowsPrecondition.Options
  ) {
    super(context, {
      ...options,
      name: "GlobalDebug",
      position: 11,
      enabled: isDebug,
    });
  }

  public override messageRun(message: Message) {
    return this.isDebugUser(message.author.id);
  }

  public override chatInputRun(interaction: ChatInputCommandInteraction) {
    return this.isDebugUser(interaction.user.id);
  }

  public override contextMenuRun(interaction: ContextMenuCommandInteraction) {
    return this.isDebugUser(interaction.user.id);
  }

  private async isDebugUser(userId: string) {
    if (debugUsers.includes(userId)) {
      return this.ok();
    }

    return this.error({
      message: this.message,
    });
  }
}

export { GlobalDebug };
