import { GitStorageOptions } from '@design-sync/storage';

export type RemoteStorageType = 'github' | 'gitlab' | 'bitbucket' | 'azure-devops';
export interface RemoteStorage extends GitStorageOptions {
  id: string;
  name: string;
  type: RemoteStorageType;
  filePath: string;
}
export type RemoteStorageWithoutId = Omit<RemoteStorage, 'id'>;
