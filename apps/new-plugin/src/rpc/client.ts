import { RpcClient } from '@design-sync/rpc';

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
