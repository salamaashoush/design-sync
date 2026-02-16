import type { FileStorage, SaveFileOptions } from "./git";

/**
 * Read-only storage that fetches tokens from any URL.
 */
export class GenericUrlStorage implements FileStorage {
  constructor(private url: string) {}

  async load(): Promise<any> {
    const response = await fetch(this.url);
    if (!response.ok) {
      throw new Error(`Failed to load tokens from ${this.url}`);
    }
    return response.json();
  }

  async save(_tokens: any, _options: SaveFileOptions): Promise<void> {
    throw new Error("GenericUrlStorage is read-only");
  }
}
