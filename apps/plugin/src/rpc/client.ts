import { RpcClient } from '@tokenize/rpc';

export const client = new RpcClient({
  postMessage: (message) => parent.postMessage(message, '*'),
  addEventListener: (type, handler) => window.addEventListener(type, handler),
  removeEventListener: (type, handler) => window.removeEventListener(type, handler),
});
