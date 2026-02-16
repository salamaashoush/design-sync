export type RemoteStorageType =
  | "github"
  | "gitlab"
  | "bitbucket"
  | "azure-devops"
  | "url"
  | "jsonbin";

export interface RemoteStorage {
  id: string;
  name: string;
  uri: string;
  accessToken: string;
  apiUrl?: string;
}

export type RemoteStorageWithoutId = Omit<RemoteStorage, "id">;

export interface DiffEntry {
  path: string;
  type: "add" | "update" | "remove";
  oldValue?: string;
  newValue?: string;
}

export type DiffResult = DiffEntry[];

export interface TokenSet {
  name: string;
  tokens: Record<string, unknown>;
  enabled: boolean;
}

export interface TokenSetRef {
  name: string;
  enabled: boolean;
}

export interface TokenTheme {
  name: string;
  sets: TokenSetRef[];
}

export interface ThemesConfig {
  themes: TokenTheme[];
}
