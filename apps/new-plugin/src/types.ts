import { GitStorageOptions } from '@tokenize/storage';

export interface DesignTokensMode {
  name: string;
  id: string;
  path: string;
}

export interface DesignTokensGroupMetadata {
  name: string;
  description?: string;
  modes: DesignTokensMode[];
}

export type RemoteStorageType = 'github' | 'gitlab' | 'bitbucket' | 'azure-devops';
export interface RemoteStorage {
  id: string;
  name: string;
  type: RemoteStorageType;
  settings: GitStorageOptions;
}
export type RemoteStorageWithouthId = Omit<RemoteStorage, 'id'>;
