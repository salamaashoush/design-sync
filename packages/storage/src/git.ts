export interface SaveFileOptions {
  commitMessage: string;
  filePath: string;
  branch?: string;
}

export interface GitStorageOptions {
  accessToken: string;
  branch: string;
  repoPath: string;
}

export interface FileStorage {
  save(tokens: any, options: SaveFileOptions): Promise<void>;
  load(filePath: string): Promise<any>;
}

export abstract class GitStorage<T extends GitStorageOptions = GitStorageOptions> implements FileStorage {
  constructor(public options: T) {}
  abstract save(tokens: any, options: SaveFileOptions): Promise<void>;
  abstract load<D = any>(filePath: string): Promise<D>;
}
