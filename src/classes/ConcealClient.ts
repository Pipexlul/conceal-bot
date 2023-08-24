import { SapphireClient } from "@sapphire/framework";
import type { ClientOptions } from "discord.js";
import type { ConcealClientOptions } from "../interfaces/ConcealClientOptions";

class ConcealClient extends SapphireClient {
  private customOptions?: ConcealClientOptions;

  public constructor(
    saphOptions: ClientOptions,
    options?: ConcealClientOptions
  ) {
    super(saphOptions);

    this.customOptions = options;
  }
}

export default ConcealClient;
