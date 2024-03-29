import { AllFlowsPrecondition } from "@sapphire/framework";
import type {
  CommandInteraction,
  ContextMenuCommandInteraction,
  Message,
} from "discord.js";

import envConfig from "../config/env";
const {
  conceal: { pipex },
} = envConfig;

class PipexOnlyPrecondition extends AllFlowsPrecondition {
  public override async messageRun(message: Message) {
    return this.checkPipex(message.author.id);
  }

  public override async chatInputRun(interaction: CommandInteraction) {
    return this.checkPipex(interaction.user.id);
  }

  public override async contextMenuRun(
    interaction: ContextMenuCommandInteraction
  ) {
    return this.checkPipex(interaction.user.id);
  }

  private async checkPipex(userId: string) {
    return userId === pipex
      ? this.ok()
      : this.error({
          message: "This command can only be used by Pipex",
        });
  }
}

export { PipexOnlyPrecondition };
