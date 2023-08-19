import { SapphireClient } from "@sapphire/framework";
import type { ClientOptions } from "discord.js";
import type { ConcealClientOptions } from "../interfaces/ConcealClientOptions";
import { getRootData } from "@sapphire/pieces";

class ConcealClient extends SapphireClient {
  private rootData = getRootData();
  private customOptions?: ConcealClientOptions;

  constructor(saphOptions: ClientOptions, options?: ConcealClientOptions) {
    super(saphOptions);
    this.customOptions = options;
  }
}

export default ConcealClient;
