import { GitStorage } from '@design-sync/storage';
import { get, isObject } from '@design-sync/utils';
import { isTokenAlias, normalizeTokenAlias, type DesignToken, type TokenAlias } from '@design-sync/w3c-dtfm';
import { RemoteStorage, RemoteStorageWithoutId } from '../types';
import { createGitStorageForFigma, localStorage } from './storage';

interface SyncServiceCache {
  lastSync: number;
  tokens: Record<string, unknown>;
  sha: string;
}
export class SyncService {
  private remoteStorages = new Map<string, RemoteStorage>();
  private storageService: GitStorage | null = null;
  private tokens = new Map<string, Record<string, unknown>>();
  private activeStorageId: string | undefined;
  private lastSha = '';

  get storagePath() {
    return this.storageService?.path ?? '';
  }

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
        this.storageService = createGitStorageForFigma(activeStorageRemoteStorage, this.lastSha);
      }
    }
    await this.loadCache();
    console.log('init');
    return true;
  }

  private async loadCache() {
    const id = this.activeStorageId;
    if (!id) {
      return;
    }
    const cache = await localStorage.get<SyncServiceCache>(id);
    console.log('loaded cache', cache, id);
    if (cache) {
      const path = this.storagePath;
      if (cache.tokens) {
        this.tokens.set(path, cache.tokens);
      }
      this.lastSha = cache.sha;
    }
  }

  private async saveCache() {
    const id = this.activeStorageId;
    if (!id) {
      return;
    }
    const path = this.storagePath;
    const cache: SyncServiceCache = {
      lastSync: Date.now(),
      tokens: this.tokens.get(path) ?? {},
      sha: this.lastSha,
    };
    console.log('save cache', cache, id);
    await localStorage.set(id, cache);
  }

  async isOutdated() {
    if (!this.lastSha) {
      return true;
    }

    if (this.tokens.size === 0) {
      return true;
    }
    const sha = await this.storageService?.getSha();
    return sha !== this.lastSha;
  }

  private async loadRemoteTokens() {
    const [sha, tokens] = (await this.storageService?.load<Record<string, unknown>>()) ?? [];
    this.lastSha = sha ?? '';
    if (tokens) {
      this.tokens.set(this.storagePath, tokens);
      await this.saveCache();
    }
    console.log('loaded remote tokens', tokens);
    return tokens ?? {};
  }

  async loadTokens(forceRemote = false) {
    const isOutdated = forceRemote || (await this.isOutdated());
    console.log('isOutdated', isOutdated, this.lastSha);
    if (isOutdated) {
      await this.loadRemoteTokens();
    }
    return this.tokens.get(this.storagePath) ?? {};
  }

  async saveTokens(tokens: Record<string, unknown>) {
    const filePath = this.storagePath;
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
    if (!this.activeStorageId) {
      this.activateRemoteStorage(id);
    }
  }

  removeRemoteStorage(id: string) {
    this.remoteStorages.delete(id);
    localStorage.set('remoteStorages', Array.from(this.remoteStorages.values()));
    if (this.activeStorageId === id) {
      this.activeStorageId = undefined;
      localStorage.set('activeStorage', undefined);
    }
  }

  updateRemoteStorage(storage: RemoteStorage) {
    this.remoteStorages.set(storage.id, storage);
    localStorage.set('remoteStorages', Array.from(this.remoteStorages.values()));
    if (storage.id === this.activeStorageId) {
      this.activateRemoteStorage(storage.id);
    }
  }

  async activateRemoteStorage(id: string) {
    const storage = this.remoteStorages.get(id);
    if (storage) {
      this.storageService = createGitStorageForFigma(storage);
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
