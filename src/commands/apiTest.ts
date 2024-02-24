import { Command } from "@sapphire/framework";
import axios from "axios";

import envVars from "../config/env";
import { getServerIds } from "../utils/envUtils";

const {
  apiKeys: { elevenlabs },
} = envVars;

class ELabsTestCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: "apitest",
      description: "test api call",
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) => builder.setName(this.name).setDescription(this.description),
      {
        guildIds: getServerIds(),
        // idHints: ["1144162080845467730"],
      }
    );
  }

  public override async chatInputRun(
    interaction: Command.ChatInputCommandInteraction
  ) {
    await interaction.deferReply();

    const res = await axios.get("https://api.elevenlabs.io/v1/voices", {
      headers: {
        "xi-api-key": elevenlabs,
      },
    });

    return interaction.editReply({
      content: JSON.stringify(res.data.voices[0], null, 2),
    });
  }
}

export { ELabsTestCommand };
