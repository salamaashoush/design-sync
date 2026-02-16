export interface SaveFileOptions {
  commitMessage: string;
  filePath: string;
  branch?: string;
}

export interface GitInfo {
  provider: "github" | "gitlab" | "bitbucket" | "azure";
  repo: string;
  path: string;
  ref: string;
  apiUrl?: string;
}

export interface GitStorageOptions extends Omit<GitInfo, "provider"> {
  accessToken: string;
  apiUrl?: string;
}

export interface PullRequestOptions {
  title: string;
  description?: string;
  sourceBranch: string;
  targetBranch: string;
}

export interface PullRequestResult {
  url: string;
  id: string | number;
}

export interface FileStorage {
  save(tokens: any, options: SaveFileOptions): Promise<void>;
  load(filePath: string): Promise<any>;
  listBranches?(): Promise<string[]>;
  createBranch?(name: string, fromRef?: string): Promise<void>;
  createPullRequest?(options: PullRequestOptions): Promise<PullRequestResult>;
  listFiles?(dir: string): Promise<string[]>;
  saveBatch?(
    files: Array<{ path: string; content: string }>,
    options: SaveFileOptions,
  ): Promise<void>;
  loadBatch?(paths: string[]): Promise<Array<{ path: string; content: any }>>;
}

export class Base64Encoder {
  encode(data: string): string {
    return btoa(data);
  }
  decode(data: string): any {
    return atob(data);
  }
}
export abstract class GitStorage<
  T extends GitStorageOptions = GitStorageOptions,
> implements FileStorage {
  public accessToken: string;
  public repo: string;
  public path: string;
  public ref = "main";
  public apiUrl?: string;

  constructor(
    info: T,
    protected base64 = new Base64Encoder(),
  ) {
    this.accessToken = info.accessToken;
    this.repo = info.repo;
    this.path = info.path;
    this.ref = info.ref;
    this.apiUrl = info.apiUrl;
  }
  abstract save(tokens: any, options: SaveFileOptions): Promise<void>;
  abstract load<D = any>(path?: string): Promise<D>;
}
