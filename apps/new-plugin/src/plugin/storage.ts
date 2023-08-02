import {
  AzureDevOpsStorage,
  BitbucketStorage,
  GithubStorage,
  GitlabStorage,
  LocalStorage,
  PluginDataStorage,
} from '@tokenize/storage';
import { RemoteStorage } from '../types';

export const pluginDataStorage = new PluginDataStorage();
export const localStorage = new LocalStorage();

export function createGitStorage(remoteStorage: RemoteStorage) {
  switch (remoteStorage.type) {
    case 'github':
      return new GithubStorage(remoteStorage.settings);
    case 'gitlab':
      return new GitlabStorage(remoteStorage.settings);
    case 'bitbucket':
      return new BitbucketStorage(remoteStorage.settings);
    case 'azure-devops':
      return new AzureDevOpsStorage(remoteStorage.settings);
    default:
      throw new Error(`Unknown remote storage type: ${remoteStorage.type}`);
  }
}
