import { GitStorage } from '@design-sync/storage';
import { get, isObject } from '@design-sync/utils';
import { isTokenAlias, normalizeTokenAlias, type DesignToken, type TokenAlias } from '@design-sync/w3c-dtfm';
import { RemoteStorage, RemoteStorageWithoutId } from '../types';
import { createGitStorage, localStorage } from './storage';

export class SyncService {
  private remoteStorages: Map<string, RemoteStorage> = new Map();
  private storageService: GitStorage | null = null;
  private tokens = new Map<string, object>();
  private activeStorageId: string | undefined;

  async init() {
    const remoteStorages = (await localStorage.get<RemoteStorage[]>('remoteStorages')) ?? [];
    this.activeStorageId = await localStorage.get<string>('activeStorage');
    if (remoteStorages) {
      for (const storage of remoteStorages) {
        this.remoteStorages.set(storage.id, storage);
      }
    }
    if (this.activeStorageId) {
      const activeStorageRemoteStorage = this.remoteStorages.get(this.activeStorageId);
      if (activeStorageRemoteStorage) {
        this.storageService = createGitStorage(activeStorageRemoteStorage);
      }
    }
    return true;
  }

  async loadTokens() {
    const filePath = this.getActiveRemoteStorage()?.filePath ?? 'tokens.json';
    const tokens = await this.storageService?.load<object>(filePath);
    console.log('loaded tokens', this.storageService?.options, tokens);
    if (tokens) {
      this.tokens.set(filePath, tokens);
    }
    return tokens;
  }

  async saveTokens(tokens: object) {
    const filePath = this.getActiveRemoteStorage()?.filePath ?? 'tokens.json';
    console.log('saving tokens', this.storageService?.options, tokens);
    await this.storageService?.save(tokens, {
      commitMessage: `Update tokens.json`,
      filePath,
    });
    this.tokens.set(filePath, tokens);
  }

  getActiveRemoteStorage() {
    return this.remoteStorages.get(this.activeStorageId!);
  }

  getRemoteStorages() {
    return Array.from(this.remoteStorages.values());
  }

  addRemoteStorage(storage: RemoteStorageWithoutId) {
    const id = Date.now().toString();
    this.remoteStorages.set(id, {
      ...storage,
      id,
    });
    localStorage.set('remoteStorages', Array.from(this.remoteStorages.values()));
  }

  removeRemoteStorage(id: string) {
    this.remoteStorages.delete(id);
    localStorage.set('remoteStorages', Array.from(this.remoteStorages.values()));
  }

  updateRemoteStorage(storage: RemoteStorage) {
    this.remoteStorages.set(storage.id, storage);
    localStorage.set('remoteStorages', Array.from(this.remoteStorages.values()));
  }

  async activateRemoteStorage(id: string) {
    const storage = this.remoteStorages.get(id);
    if (storage) {
      this.storageService = createGitStorage(storage);
      this.activeStorageId = id;
      localStorage.set('activeStorage', id);
    }
  }

  getTokenByRefOrPath(ref: TokenAlias, name?: string) {
    const path = normalizeTokenAlias(ref);
    if (name) {
      const group = this.tokens.get(name);
      if (group) {
        return get(group, path);
      }
    }
    for (const group of this.tokens.values()) {
      const token = get(group, path);
      if (token) {
        return token;
      }
    }
    return undefined;
  }

  resolveTokenValue<T extends DesignToken>({ $value }: T): T['$value'] {
    if (isTokenAlias($value)) {
      const resolved = this.getTokenByRefOrPath($value).$value;
      return this.resolveTokenValue(resolved);
    }
    if (isObject($value)) {
      const resolved: Record<string, unknown> = {};
      for (const key in $value) {
        resolved[key] = this.resolveTokenValue(($value as any)[key]);
      }
      return resolved;
    }
    return $value;
  }
}

export const syncService = new SyncService();
