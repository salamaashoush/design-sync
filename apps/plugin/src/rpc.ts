import { JsonRpcCall, RpcClient, RpcServer } from '@tokenize/rpc';
import type { Token, TokenSet } from './types';

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

export const client = new RpcClient();
export const server = new RpcServer({
  addEventListener: figma.ui.on,
  removeEventListener: figma.ui.off,
  postMessage: (message) =>
    figma.ui.postMessage(message, {
      origin: '*',
    }),
});
