import { GitStorage } from '@tokenize/storage';
import { get, isObject } from '@tokenize/utils';
import { DesignTokensGroup, isTokenAlias, type DesignToken, type TokenAlais } from '@tokenize/w3c-tokens';
import { RemoteStorage, RemoteStorageWithouthId } from '../types';
import { createGitStorage, localStorage } from './storage';

export class SyncService {
  private remoteStorages: Map<string, RemoteStorage> = new Map();
  private storageService: GitStorage | null = null;
  private tokens = new Map<string, DesignTokensGroup>();
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

  async getTokens(group: string) {
    // if (!this.tokenSets.length) {
    //   const fromCache = await this.localStorage.get<DesignTokensGroup[]>('tokens');
    //   console.log('fromCache', fromCache);
    //   if (fromCache) {
    //     this.tokenSets = fromCache;
    //   } else {
    //     const tokens = await this.remoteStorage.load('src/quin-pro-tokens.json');
    //     this.tokenSets = [tokens];
    //     this.localStorage.set('tokens', this.tokenSets);
    //   }
    // }
    return this.tokens.get(group);
  }

  async loadTokens(group: string) {
    const tokens = await this.storageService?.load<DesignTokensGroup>(`src/${group}.json`);
    if (tokens) {
      this.tokens.set(group, tokens);
    }
    return tokens;
  }

  async saveTokens(group: string, tokens: DesignTokensGroup) {
    await this.storageService?.save(tokens, {
      commitMessage: `Update ${group} tokens`,
      filePath: `src/${group}.json`,
    });
    this.tokens.set(group, tokens);
  }

  getRemoteStorages() {
    return Array.from(this.remoteStorages.values()).map((storage) => ({
      name: storage.name,
      id: storage.id,
      active: this.activeStorageId === storage.id,
    }));
  }

  addRemoteStorage(storage: RemoteStorageWithouthId) {
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

  getTokenByRefOrPath(ref: TokenAlais, name?: string) {
    const path = ref.replace(/[$,{}]/g, '');
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
