export interface RpcTransport {
  send(message: unknown): void;
  listen(handler: (message: unknown) => void): () => void;
}

export interface PostMessageTransportOptions {
  targetOrigin?: string;
}

/**
 * Transport for the Figma plugin UI side.
 * Sends via `window.parent.postMessage({ pluginMessage })`, receives by unwrapping `event.data.pluginMessage`.
 */
export function createFigmaUITransport(): RpcTransport {
  return {
    send(message) {
      window.parent.postMessage({ pluginMessage: message }, "*");
    },
    listen(handler) {
      const onMessage = (event: MessageEvent) => {
        if (event.data?.pluginMessage !== undefined) {
          handler(event.data.pluginMessage);
        }
      };
      window.addEventListener("message", onMessage);
      return () => window.removeEventListener("message", onMessage);
    },
  };
}

/**
 * Transport for the Figma plugin main thread side.
 * Uses `figma.ui.postMessage` / `figma.ui.on('message')`.
 */
export function createFigmaMainTransport(ui: {
  postMessage(message: unknown, options?: { origin: string }): void;
  on(event: "message", handler: (message: unknown) => void): void;
  off(event: "message", handler: (message: unknown) => void): void;
}): RpcTransport {
  return {
    send(message) {
      ui.postMessage(message, { origin: "*" });
    },
    listen(handler) {
      ui.on("message", handler);
      return () => ui.off("message", handler);
    },
  };
}

/**
 * Generic postMessage transport for iframes/windows.
 */
export function createPostMessageTransport(
  target: Window,
  source: Window | EventTarget = window,
  options?: PostMessageTransportOptions,
): RpcTransport {
  const origin = options?.targetOrigin ?? "*";
  return {
    send(message) {
      target.postMessage(message, origin);
    },
    listen(handler) {
      const onMessage = (event: Event) => {
        if (event instanceof MessageEvent) {
          handler(event.data);
        }
      };
      source.addEventListener("message", onMessage);
      return () => source.removeEventListener("message", onMessage);
    },
  };
}
