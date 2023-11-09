import { RpcServer } from '@design-sync/rpc';

export const server = new RpcServer({
  addEventListener: figma.ui.on,
  removeEventListener: figma.ui.off,
  postMessage: (message) =>
    figma.ui.postMessage(message, {
      origin: '*',
    }),
});
