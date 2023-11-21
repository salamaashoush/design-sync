export interface SaveFileOptions {
  commitMessage: string;
  filePath: string;
  branch?: string;
}

export interface GitInfo {
  provider: 'github' | 'gitlab' | 'bitbucket' | 'azure';
  repo: string;
  path: string;
  ref: string;
}

export interface GitStorageOptions extends Omit<GitInfo, 'provider'> {
  accessToken: string;
}

export interface FileStorage {
  save(tokens: any, options: SaveFileOptions): Promise<void>;
  load(filePath: string): Promise<any>;
}

export class Base64Encoder {
  encode(data: string): string {
    return btoa(data);
  }
  decode(data: string): any {
    return atob(data);
  }
}
export abstract class GitStorage<T extends GitStorageOptions = GitStorageOptions> implements FileStorage {
  public accessToken: string;
  public repo: string;
  public path: string;
  public ref = 'main';

  constructor(
    info: T,
    protected base64 = new Base64Encoder(),
  ) {
    this.accessToken = info.accessToken;
    this.repo = info.repo;
    this.path = info.path;
    this.ref = info.ref;
  }
  abstract save(tokens: any, options: SaveFileOptions): Promise<void>;
  abstract load<D = any>(path?: string): Promise<D>;
}
