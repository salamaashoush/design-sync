export interface LocalStorageOptions {
  serialize?: <T>(value: T) => string;
  deserialize?: <T>(value: string) => T;
}
export class LocalStorage {
  private serialize: <T>(value: T) => string;
  private deserialize: <T>(value: string) => T;

  constructor({ serialize = JSON.stringify, deserialize = JSON.parse }: LocalStorageOptions = {}) {
    if (!figma.clientStorage) {
      throw new Error('Client storage is not available');
    }
    this.serialize = serialize;
    this.deserialize = deserialize;
  }

  async set<T>(key: string, value: T): Promise<void> {
    await figma.clientStorage.setAsync(key, this.serialize(value));
  }

  async get<T>(key: string, defaultValue?: T): Promise<T | undefined> {
    const data = await figma.clientStorage.getAsync(key);
    if (data) {
      return this.deserialize(data);
    }
    return defaultValue;
  }

  async remove(key: string): Promise<void> {
    await figma.clientStorage.deleteAsync(key);
  }

  async keys(): Promise<string[]> {
    return figma.clientStorage.keysAsync();
  }

  async clear(): Promise<void> {
    const keys = await figma.clientStorage.keysAsync();
    for (const key of keys) {
      await figma.clientStorage.deleteAsync(key);
    }
  }
}

export const localStorage = new LocalStorage();
