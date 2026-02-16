import { JsonRpcCall } from "@design-sync/rpc";
import type { PullRequestOptions, PullRequestResult } from "@design-sync/storage";
import {
  DiffResult,
  RemoteStorage,
  RemoteStorageWithoutId,
  ThemesConfig,
  TokenSetRef,
  TokenTheme,
} from "./types";

export interface UIItem {
  id: string;
  name: string;
}

export interface UIVraibleCollection extends UIItem {
  type: "local" | "library";
}

export interface GetStylesResponse {
  typography: UIItem[];
  gradients: UIItem[];
  shadows: UIItem[];
}

export interface SyncTokenParams {
  collections: string[];
  exportPaints: boolean;
  exportTypography: boolean;
  exportShadows: boolean;
}

export interface ExportPreviewParams {
  collections: string[];
  exportStyles: {
    typography: boolean;
    shadows: boolean;
    paints: boolean;
  };
}

export interface PushParams {
  collections: string[];
  exportStyles: {
    typography: boolean;
    shadows: boolean;
    paints: boolean;
  };
  commitMessage: string;
}

interface GetVariablesResponse {
  local: UIVraibleCollection[];
  library: UIVraibleCollection[];
}

declare global {
  interface RpcCalls {
    init: JsonRpcCall<"init", void, boolean>;
    resize: JsonRpcCall<"resize", { height: number; width: number }, void>;
    "tokens/sync": JsonRpcCall<"tokens/sync", SyncTokenParams, void>;
    "variables/get": JsonRpcCall<"variables/get", void, GetVariablesResponse>;
    "styles/get": JsonRpcCall<"styles/get", void, GetStylesResponse>;
    "remoteStorages/all": JsonRpcCall<"remoteStorages/all", void, RemoteStorage[]>;
    "remoteStorages/getActive": JsonRpcCall<"remoteStorages/getActive", void, RemoteStorage>;
    "remoteStorages/add": JsonRpcCall<"remoteStorages/add", RemoteStorageWithoutId, void>;
    "remoteStorages/remove": JsonRpcCall<"remoteStorages/remove", string, void>;
    "remoteStorages/activate": JsonRpcCall<"remoteStorages/activate", string, void>;
    "remoteStorages/update": JsonRpcCall<"remoteStorages/update", RemoteStorage, void>;
    "remoteStorages/pull": JsonRpcCall<"remoteStorages/pull", string, void>;
    "remoteStorages/push": JsonRpcCall<"remoteStorages/push", string, void>;
    "sync/export-preview": JsonRpcCall<"sync/export-preview", ExportPreviewParams, DiffResult>;
    "sync/push": JsonRpcCall<"sync/push", PushParams, void>;
    "sync/pull-preview": JsonRpcCall<"sync/pull-preview", void, DiffResult>;
    "sync/apply": JsonRpcCall<
      "sync/apply",
      { selectedPaths?: string[] } | void,
      { created: number; updated: number }
    >;
    "branches/list": JsonRpcCall<"branches/list", void, string[]>;
    "branches/create": JsonRpcCall<"branches/create", { name: string; fromRef?: string }, void>;
    "branches/switch": JsonRpcCall<"branches/switch", string, void>;
    "sync/create-pr": JsonRpcCall<"sync/create-pr", PullRequestOptions, PullRequestResult>;
    "themes/get": JsonRpcCall<"themes/get", void, ThemesConfig>;
    "themes/save": JsonRpcCall<"themes/save", ThemesConfig, void>;
    "themes/apply": JsonRpcCall<"themes/apply", TokenTheme, { created: number; updated: number }>;
    "sets/list": JsonRpcCall<"sets/list", void, TokenSetRef[]>;
    "tokens/get": JsonRpcCall<
      "tokens/get",
      string,
      { path: string; token: Record<string, unknown> } | null
    >;
    "tokens/update": JsonRpcCall<
      "tokens/update",
      { path: string; token: Record<string, unknown> },
      void
    >;
    "tokens/create": JsonRpcCall<
      "tokens/create",
      { path: string; token: Record<string, unknown> },
      void
    >;
    "tokens/delete": JsonRpcCall<"tokens/delete", string, void>;
    "tokens/tree": JsonRpcCall<"tokens/tree", void, Record<string, unknown>>;
  }
}
