import { RpcServer } from '@design-sync/json-rpc-utils';

export const server = new RpcServer({
  addEventListener: figma.ui.on,
  removeEventListener: figma.ui.off,
  postMessage: (message) =>
    figma.ui.postMessage(message, {
      origin: '*',
    }),
});
