import { AllFlowsPrecondition } from "@sapphire/framework";
import type {
  CommandInteraction,
  ContextMenuCommandInteraction,
  Message,
} from "discord.js";

import envConfig from "../config/env";
const {
  conceal: { mellow },
} = envConfig;

class MellowOnlyPrecondition extends AllFlowsPrecondition {
  private errMessage = "This command can only be used by MellowLiving";

  public override async messageRun(message: Message) {
    return this.checkMellow(message.author.id);
  }

  public override async chatInputRun(interaction: CommandInteraction) {
    return this.checkMellow(interaction.user.id);
  }

  public override async contextMenuRun(
    interaction: ContextMenuCommandInteraction
  ) {
    return this.checkMellow(interaction.user.id);
  }

  private async checkMellow(userId: string) {
    return userId === mellow
      ? this.ok()
      : this.error({
          message: this.errMessage,
        });
  }
}

export { MellowOnlyPrecondition };
