import { GetVoicesResponseModel } from "elevenlabs/api";
import { eLabsClient } from "../ElevenLabs";

class LinkerService {
  private characterData: GetVoicesResponseModel["voices"] = [];

  private workspaceId = "conceal";

  constructor() {
    eLabsClient.voices.getAll().then((res) => {
      this.characterData = res.voices;
    });
  }

  private _inworldToElevenLabs = new Map<string, string>([
    ["solid_snake", "David Hayter"],
  ]);

  private getKey = (inworldId: string) =>
    `workspaces/${this.workspaceId}/characters/${inworldId.toLowerCase()}`;

  public getElevenLabsId(inworldId: string): string {
    const name =
      this._inworldToElevenLabs.get(this.getKey(inworldId)) ?? "Ethan";

    return this.characterData.find((v) => v.name === name)?.voice_id ?? "Ethan";
  }
}

const linkerService = new LinkerService();

export { linkerService };
