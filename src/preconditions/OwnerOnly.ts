import { AllFlowsPrecondition } from "@sapphire/framework";
import type {
  CommandInteraction,
  ContextMenuCommandInteraction,
  Message,
} from "discord.js";

import envConfig from "../config/env";
const { ownerId } = envConfig;

export class OwnerOnlyPrecondition extends AllFlowsPrecondition {
  public override async messageRun(message: Message) {
    return this.checkOwner(message.author.id);
  }

  public override async chatInputRun(interaction: CommandInteraction) {
    return this.checkOwner(interaction.user.id);
  }

  public override async contextMenuRun(
    interaction: ContextMenuCommandInteraction
  ) {
    return this.checkOwner(interaction.user.id);
  }

  private async checkOwner(userId: string) {
    return userId === ownerId
      ? this.ok()
      : this.error({
          message: "This command can only be used by the bot owner",
        });
  }
}
