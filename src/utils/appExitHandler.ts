import type { SapphireClient } from "@sapphire/framework";

const terminateEvents: string[] = ["SIGKILL", "SIGTERM", "SIGINT", "exit"];

const applyExitHandlers = (client: SapphireClient) => {
  const terminateHandler = () => {
    if (client.token !== null) {
      console.log("Bot client shutting down...");
      client.destroy().then(() => {
        console.log("Bot client destroyed");
      });
    }
  };

  terminateEvents.forEach((event) => {
    process.on(event, terminateHandler);
  });

  console.log("Successfully applied exit handlers");
};

export { applyExitHandlers };
