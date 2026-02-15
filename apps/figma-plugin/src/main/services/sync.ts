import { GitStorage } from "@design-sync/storage";
import { get, isObject } from "@design-sync/utils";
import {
  isTokenAlias,
  normalizeTokenAlias,
  type DesignToken,
  type TokenAlias,
} from "@design-sync/w3c-dtfm";
import type { DiffResult, RemoteStorage, RemoteStorageWithoutId } from "../../shared/types";
import { createGitStorageForFigma, localStorage } from "./storage";
import { stylesService } from "./styles";
import { variablesService } from "./variables";

export class SyncService {
  private remoteStorages: Map<string, RemoteStorage> = new Map();
  private storageService: GitStorage | null = null;
  private tokens = new Map<string, object>();
  private activeStorageId: string | undefined;

  async init() {
    const remoteStorages = (await localStorage.get<RemoteStorage[]>("remoteStorages")) ?? [];
    this.activeStorageId = await localStorage.get<string>("activeStorage");
    if (remoteStorages) {
      for (const storage of remoteStorages) {
        this.remoteStorages.set(storage.id, storage);
      }
    }
    if (this.activeStorageId) {
      const activeStorageRemoteStorage = this.remoteStorages.get(this.activeStorageId);
      if (activeStorageRemoteStorage) {
        this.storageService = createGitStorageForFigma(activeStorageRemoteStorage);
      }
    }
    return true;
  }

  async loadTokens() {
    const filePath = this.storageService?.path ?? "tokens.json";
    const tokens = await this.storageService?.load<object>(filePath);

    if (tokens) {
      this.tokens.set(filePath, tokens);
    }
    console.log("loaded tokens", tokens);
    return tokens;
  }

  async saveTokens(tokens: object, commitMessage?: string) {
    const filePath = this.storageService?.path ?? "tokens.json";
    console.log("saving tokens", tokens);
    await this.storageService?.save(tokens, {
      commitMessage: commitMessage ?? `Update tokens.json`,
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
    localStorage.set("remoteStorages", Array.from(this.remoteStorages.values()));
  }

  removeRemoteStorage(id: string) {
    this.remoteStorages.delete(id);
    localStorage.set("remoteStorages", Array.from(this.remoteStorages.values()));
  }

  updateRemoteStorage(storage: RemoteStorage) {
    this.remoteStorages.set(storage.id, storage);
    localStorage.set("remoteStorages", Array.from(this.remoteStorages.values()));
  }

  async activateRemoteStorage(id: string) {
    const storage = this.remoteStorages.get(id);
    if (storage) {
      this.storageService = createGitStorageForFigma(storage);
      this.activeStorageId = id;
      localStorage.set("activeStorage", id);
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

  resolveTokenValue<T extends DesignToken>({ $value }: T): T["$value"] {
    if (isTokenAlias($value)) {
      const resolved = this.getTokenByRefOrPath($value).$value;
      return this.resolveTokenValue(resolved);
    }
    if (isObject($value)) {
      const obj = $value as Record<string, unknown>;
      const resolved: Record<string, unknown> = {};
      for (const key in obj) {
        resolved[key] = this.resolveTokenValue(obj[key] as DesignToken);
      }
      return resolved;
    }
    return $value;
  }

  async getExportPreview(
    collections: string[],
    styleOptions: { typography: boolean; shadows: boolean; paints: boolean },
  ): Promise<DiffResult> {
    // Generate local tokens from selected collections and styles
    const localTokens: Record<string, any> = {};

    if (collections.length > 0) {
      const exported = await variablesService.exportToDesignTokens(collections, true);
      for (const file of exported) {
        Object.assign(localTokens, file.tokens);
      }
    }

    if (styleOptions.typography) {
      Object.assign(localTokens, { typography: stylesService.textStylesToDesignTokens() });
    }
    if (styleOptions.shadows) {
      Object.assign(localTokens, { shadows: stylesService.shadowStylesToDesignTokens() });
    }
    if (styleOptions.paints) {
      const { colors, gradients } = stylesService.paintStylesToDesignTokens();
      Object.assign(localTokens, { colors, gradients });
    }

    // Load remote tokens for comparison
    const remoteTokens = await this.loadTokens();
    const diff: DiffResult = [];

    // Compare local tokens against remote tokens
    this.diffObjects(localTokens, (remoteTokens as Record<string, any>) ?? {}, "", diff);

    return diff;
  }

  async getImportPreview(): Promise<DiffResult> {
    const remoteTokens = await this.loadTokens();
    if (!remoteTokens) {
      return [];
    }
    return variablesService.diffImport(remoteTokens as Record<string, unknown>);
  }

  private diffObjects(
    local: Record<string, any>,
    remote: Record<string, any>,
    prefix: string,
    diff: DiffResult,
  ) {
    const allKeys = new Set([...Object.keys(local), ...Object.keys(remote)]);

    for (const key of allKeys) {
      if (key.startsWith("$")) {
        continue;
      }
      const path = prefix ? `${prefix}.${key}` : key;
      const localVal = local[key];
      const remoteVal = remote[key];

      if (localVal !== undefined && remoteVal === undefined) {
        diff.push({ path, type: "add", newValue: JSON.stringify(localVal) });
      } else if (localVal === undefined && remoteVal !== undefined) {
        diff.push({ path, type: "remove", oldValue: JSON.stringify(remoteVal) });
      } else if (isObject(localVal) && isObject(remoteVal)) {
        // Check if this is a token (has $value)
        if ("$value" in localVal || "$value" in remoteVal) {
          const localStr = JSON.stringify(localVal);
          const remoteStr = JSON.stringify(remoteVal);
          if (localStr !== remoteStr) {
            diff.push({ path, type: "update", oldValue: remoteStr, newValue: localStr });
          }
        } else {
          this.diffObjects(localVal, remoteVal, path, diff);
        }
      } else if (JSON.stringify(localVal) !== JSON.stringify(remoteVal)) {
        diff.push({
          path,
          type: "update",
          oldValue: JSON.stringify(remoteVal),
          newValue: JSON.stringify(localVal),
        });
      }
    }
  }
}

export const syncService = new SyncService();
