export interface SaveFileOptions {
  commitMessage: string;
  filePath: string;
  branch?: string;
}

export interface GitStorageOptions {
  accessToken: string;
  branch: string;
  // owner/repo
  repoPath: string;
}

export interface FileStorage {
  save(tokens: any, options: SaveFileOptions): Promise<void>;
  load(filePath: string): Promise<any>;
}

export abstract class GitStorage implements FileStorage {
  constructor(protected options: GitStorageOptions) {}
  abstract save(tokens: any, options: SaveFileOptions): Promise<void>;
  abstract load(filePath: string): Promise<any>;
}
