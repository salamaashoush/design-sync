import { RpcClient } from '@design-sync/json-rpc-utils';

export const client = new RpcClient({
  postMessage: (message) =>
    window.parent.postMessage(
      {
        pluginMessage: message,
      },
      '*',
    ),
  addEventListener: (type, handler) => window.addEventListener(type, handler),
  removeEventListener: (type, handler) => window.removeEventListener(type, handler),
});
