import { LocalStorage, PluginDataStorage, createGitStorage } from '@design-sync/storage';
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
const base64 = new FigmaBase64Encoder();
export function createGitStorageForFigma(remoteStorage: RemoteStorage) {
  return createGitStorage(remoteStorage.uri, remoteStorage.accessToken, base64);
}
