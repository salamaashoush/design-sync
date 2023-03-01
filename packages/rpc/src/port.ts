export interface RpcPort {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  postMessage(message: any, targetOrigin: string, transfer?: Transferable[]): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  postMessage(message: any, options?: WindowPostMessageOptions): void;
  addEventListener(event: 'message', handler: (event: MessageEvent) => void): void;
  removeEventListener(event: 'message', handler: (event: MessageEvent) => void): void;
}

export const defaultRpcPort: RpcPort = {
  postMessage: parent.postMessage,
  addEventListener: window.addEventListener,
  removeEventListener: window.removeEventListener,
};
