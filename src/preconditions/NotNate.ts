import { AllFlowsPrecondition } from "@sapphire/framework";
import type {
  CommandInteraction,
  ContextMenuCommandInteraction,
  Message,
} from "discord.js";

import envConfig from "../config/env";
const {
  conceal: { nate },
} = envConfig;

class NotNatePrecondition extends AllFlowsPrecondition {
  public override async messageRun(message: Message) {
    return this.goAwayNate(message.author.id);
  }

  public override async chatInputRun(interaction: CommandInteraction) {
    return this.goAwayNate(interaction.user.id);
  }

  public override async contextMenuRun(
    interaction: ContextMenuCommandInteraction
  ) {
    return this.goAwayNate(interaction.user.id);
  }

  private async goAwayNate(userId: string) {
    return userId !== nate
      ? this.ok()
      : this.error({
          message: "You can't use this command, Nate",
        });
  }
}

export { NotNatePrecondition };
