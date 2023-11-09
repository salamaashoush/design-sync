import {
  AzureDevOpsStorage,
  BitbucketStorage,
  GithubStorage,
  GitlabStorage,
  LocalStorage,
  PluginDataStorage,
} from '@design-sync/storage';
import { RemoteStorage } from '../types';
import { stringToUint8Array, uint8ArrayToString } from './utils';

export const pluginDataStorage = new PluginDataStorage();
export const localStorage = new LocalStorage();

class FigmaBase64Encoder {
  encode(data: string): string {
    return figma.base64Encode(stringToUint8Array(data));
  }
  decode(data: string): string {
    return uint8ArrayToString(figma.base64Decode(data));
  }
}

export function createGitStorage(remoteStorage: RemoteStorage) {
  const base64 = new FigmaBase64Encoder();
  switch (remoteStorage.type) {
    case 'github':
      return new GithubStorage(remoteStorage, base64);
    case 'gitlab':
      return new GitlabStorage(remoteStorage, base64);
    case 'bitbucket':
      return new BitbucketStorage(remoteStorage, base64);
    case 'azure-devops':
      return new AzureDevOpsStorage(remoteStorage, base64);
    default:
      throw new Error(`Unknown remote storage type: ${remoteStorage.type}`);
  }
}
