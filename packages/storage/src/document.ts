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
    const b = this.options.branch ?? branch;
    const path = `${this.options.repoPath}/${b}/${filePath}`;
    this.pluginDataStorage.setDocumentData(path, tokens);
  }

  async load(filePath: string): Promise<any> {
    const path = `${this.options.repoPath}/${this.options.branch}/${filePath}`;
    return this.pluginDataStorage.getDocumentData(path);
  }
}
