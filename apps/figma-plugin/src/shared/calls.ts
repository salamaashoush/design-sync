import { JsonRpcCall } from '@design-sync/rpc';
import { DiffResult, RemoteStorage, RemoteStorageWithoutId } from './types';

export interface UIItem {
  id: string;
  name: string;
}

export interface UIVraibleCollection extends UIItem {
  type: 'local' | 'library';
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
    init: JsonRpcCall<'init', void, boolean>;
    resize: JsonRpcCall<'resize', { height: number; width: number }, void>;
    'tokens/sync': JsonRpcCall<'tokens/sync', SyncTokenParams, void>;
    'variables/get': JsonRpcCall<'variables/get', void, GetVariablesResponse>;
    'styles/get': JsonRpcCall<'styles/get', void, GetStylesResponse>;
    'remoteStorages/all': JsonRpcCall<'remoteStorages/all', void, RemoteStorage[]>;
    'remoteStorages/getActive': JsonRpcCall<'remoteStorages/getActive', void, RemoteStorage>;
    'remoteStorages/add': JsonRpcCall<'remoteStorages/add', RemoteStorageWithoutId, void>;
    'remoteStorages/remove': JsonRpcCall<'remoteStorages/remove', string, void>;
    'remoteStorages/activate': JsonRpcCall<'remoteStorages/activate', string, void>;
    'remoteStorages/update': JsonRpcCall<'remoteStorages/update', RemoteStorage, void>;
    'remoteStorages/pull': JsonRpcCall<'remoteStorages/pull', string, void>;
    'remoteStorages/push': JsonRpcCall<'remoteStorages/push', string, void>;
    'sync/export-preview': JsonRpcCall<'sync/export-preview', ExportPreviewParams, DiffResult>;
    'sync/push': JsonRpcCall<'sync/push', PushParams, void>;
    'sync/pull-preview': JsonRpcCall<'sync/pull-preview', void, DiffResult>;
    'sync/apply': JsonRpcCall<'sync/apply', void, { applied: number }>;
  }
}
