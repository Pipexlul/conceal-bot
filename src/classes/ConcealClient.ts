import path from "path";
import { SapphireClient } from "@sapphire/framework";
import { getRootData } from "@sapphire/pieces";
import type { ClientOptions } from "discord.js";
import type { ConcealClientOptions } from "../interfaces/ConcealClientOptions";

import { isDev } from "../utils/envUtils";

class ConcealClient extends SapphireClient {
  private rootData = getRootData();
  private customOptions?: ConcealClientOptions;

  public constructor(
    saphOptions: ClientOptions,
    options?: ConcealClientOptions
  ) {
    super(saphOptions);
    // TODO: Change store paths here if needed
    if (isDev) {
      this.rootData.root = path.join(process.cwd(), "src");

      console.log("Running in Dev mode, changed root to:", this.rootData.root);
    }

    this.customOptions = options;
  }
}

export default ConcealClient;
