import { AllFlowsPrecondition } from "@sapphire/framework";
import type {
  CommandInteraction,
  ContextMenuCommandInteraction,
  Message,
} from "discord.js";

import envConfig from "../config/env";
const {
  conceal: { jace, pipex },
} = envConfig;

const owners = [jace, pipex];

class OwnersOnlyPrecondition extends AllFlowsPrecondition {
  private errMessage = "This command can only be used by the Bot Owners";

  public override async messageRun(message: Message) {
    return this.checkOwners(message.author.id);
  }

  public override async chatInputRun(interaction: CommandInteraction) {
    return this.checkOwners(interaction.user.id);
  }

  public override async contextMenuRun(
    interaction: ContextMenuCommandInteraction
  ) {
    return this.checkOwners(interaction.user.id);
  }

  private async checkOwners(userId: string) {
    return owners.includes(userId)
      ? this.ok()
      : this.error({
          message: this.errMessage,
        });
  }
}

export { OwnersOnlyPrecondition as PipexOnlyPrecondition };
