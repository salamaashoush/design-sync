export type RemoteStorageType = 'github' | 'gitlab' | 'bitbucket' | 'azure-devops';
export interface RemoteStorage {
  id: string;
  name: string;
  uri: string;
  accessToken: string;
  apiUrl?: string;
}
export type RemoteStorageWithoutId = Omit<RemoteStorage, 'id'>;
