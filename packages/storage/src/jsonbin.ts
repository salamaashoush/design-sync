import type { FileStorage, SaveFileOptions } from "./git";

/**
 * Read/write storage using jsonbin.io API.
 */
export class JsonBinStorage implements FileStorage {
  private baseUrl = "https://api.jsonbin.io/v3";

  constructor(
    private binId: string,
    private apiKey: string,
  ) {}

  async load(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/b/${this.binId}/latest`, {
      method: "GET",
      headers: {
        "X-Master-Key": this.apiKey,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to load tokens from JSONBin");
    }
    const data = await response.json();
    return data.record;
  }

  async save(tokens: any, _options: SaveFileOptions): Promise<void> {
    const response = await fetch(`${this.baseUrl}/b/${this.binId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": this.apiKey,
      },
      body: JSON.stringify(tokens),
    });
    if (!response.ok) {
      throw new Error("Failed to save tokens to JSONBin");
    }
  }
}
