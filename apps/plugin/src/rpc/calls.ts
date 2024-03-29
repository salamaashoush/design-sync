import { JsonRpcCall } from '@design-sync/rpc';
import type { Token, TokenSet } from '../types';

interface SelectionData {
  id: string;
  name: string;
  type: string;
  data: {
    key: string;
    value: string;
  }[];
}

declare global {
  interface RpcChannelData {
    selectionchange: {
      selection: SelectionData[];
    };
  }
  interface RpcCalls {
    'variables/export': JsonRpcCall<'variables/export', void, void>;
    'variables/import': JsonRpcCall<'variables/export', void, void>;
    'tokens/get': JsonRpcCall<
      'tokens/get',
      void,
      {
        sets: TokenSet[];
      }
    >;
    'tokens/apply': JsonRpcCall<
      'tokens/apply',
      {
        target: 'selection' | 'document' | 'page';
        path: string;
        token: Token;
      }
    >;
    'tokens/change-set': JsonRpcCall<'tokens/change-set', { id: string }>;
    resize: JsonRpcCall<
      'resize',
      {
        width: number;
        height: number;
      }
    >;
  }
}
