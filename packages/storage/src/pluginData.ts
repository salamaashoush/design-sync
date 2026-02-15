import type { LocalStorageOptions } from "./local";

export class PluginDataStorage {
  private serialize: <T>(value: T) => string;
  private deserialize: <T>(value: string) => T;

  constructor({ serialize = JSON.stringify, deserialize = JSON.parse }: LocalStorageOptions = {}) {
    this.serialize = serialize;
    this.deserialize = deserialize;
  }

  setDocumentData<T>(key: string, value: T) {
    figma.root.setPluginData(key, this.serialize(value));
  }

  getDocumentData<T>(key: string, defaultValue?: T): T | undefined {
    const value = figma.root.getPluginData(key);
    if (value === "") {
      return defaultValue;
    }
    return this.deserialize(value);
  }

  setNodeData<T>(node: BaseNode, key: string, value: T) {
    node.setPluginData(key, this.serialize(value));
  }

  getNodeData<T>(node: BaseNode, key: string, defaultValue?: T): T | undefined {
    const value = node.getPluginData(key);
    if (value === "") {
      return defaultValue;
    }
    return this.deserialize(value);
  }

  setPageData<T>(page: PageNode, key: string, value: T) {
    page.setPluginData(key, this.serialize(value));
  }

  getPageData<T>(page: PageNode, key: string, defaultValue?: T): T | undefined {
    const value = page.getPluginData(key);
    if (value === "") {
      return defaultValue;
    }
    return this.deserialize(value);
  }
}
