import { GitStorageOptions } from '@design-sync/storage';

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
export interface RemoteStorage extends GitStorageOptions {
  id: string;
  name: string;
  type: RemoteStorageType;
  filePath: string;
}
export type RemoteStorageWithoutId = Omit<RemoteStorage, 'id'>;
