import { AllFlowsPrecondition } from "@sapphire/framework";
import type {
  CommandInteraction,
  ContextMenuCommandInteraction,
  Message,
} from "discord.js";

import envConfig from "../config/env";
const {
  conceal: { jace },
} = envConfig;

class JaceOnlyPrecondition extends AllFlowsPrecondition {
  public override async messageRun(message: Message) {
    return this.checkJace(message.author.id);
  }

  public override async chatInputRun(interaction: CommandInteraction) {
    return this.checkJace(interaction.user.id);
  }

  public override async contextMenuRun(
    interaction: ContextMenuCommandInteraction
  ) {
    return this.checkJace(interaction.user.id);
  }

  private async checkJace(userId: string) {
    return userId === jace
      ? this.ok()
      : this.error({
          message: "This command can only be used by Jace",
        });
  }
}

export { JaceOnlyPrecondition };
