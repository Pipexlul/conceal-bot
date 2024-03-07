import type { SapphireClient } from "@sapphire/framework";

const terminateEvents: string[] = ["SIGKILL", "SIGTERM", "SIGINT", "exit"];

const applyExitHandlers = (client: SapphireClient) => {
  const terminateHandler = async () => {
    if (client.token !== null) {
      console.log("Bot client shutting down...");
      await client.destroy();
      console.log("Bot client shut down successfully");
    }
  };

  for (const event of terminateEvents) {
    process.on(event, terminateHandler);
  }

  console.log("Successfully applied exit handlers");
};

export { applyExitHandlers };
