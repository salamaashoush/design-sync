import { GitStorage, GitStorageOptions, SaveFileOptions } from './git';
import { PluginDataStorage } from './pluginData';

export class DocumentStorage extends GitStorage {
  constructor(
    private pluginDataStorage: PluginDataStorage,
    options: GitStorageOptions,
  ) {
    super(options);
  }

  async save(tokens: any, { filePath, branch }: SaveFileOptions): Promise<void> {
    const b = this.ref ?? branch;
    const path = `${this.repo}/${b}/${filePath}`;
    this.pluginDataStorage.setDocumentData(path, tokens);
  }

  async load(filePath: string): Promise<any> {
    const path = `${this.repo}/${this.ref}/${filePath}`;
    return this.pluginDataStorage.getDocumentData(path);
  }
}
