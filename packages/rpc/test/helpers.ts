import type { RpcTransport } from "../src/transport";
import type { JsonRpcCall } from "../src/types";

// Augment global RPC types for testing
declare global {
  interface RpcCalls {
    echo: JsonRpcCall<"echo", { message: string }, string>;
    add: JsonRpcCall<"add", { a: number; b: number }, number>;
    greet: JsonRpcCall<"greet", { name: string }, string>;
    noop: JsonRpcCall<"noop", void, void>;
  }
  interface RpcChannelData {
    updates: { value: number };
    notifications: { text: string };
  }
}

/**
 * Creates a mock transport where you control both sides.
 * - `sent` accumulates messages passed to `send()`
 * - `receive(msg)` pushes a message into the listener
 */
export function createMockTransport() {
  const sent: unknown[] = [];
  let listener: ((message: unknown) => void) | null = null;

  const transport: RpcTransport = {
    send(message) {
      sent.push(message);
    },
    listen(handler) {
      listener = handler;
      return () => {
        listener = null;
      };
    },
  };

  return {
    transport,
    sent,
    receive(message: unknown) {
      listener?.(message);
    },
    get hasListener() {
      return listener !== null;
    },
  };
}

/**
 * Creates a pair of transports wired together via queueMicrotask.
 * Messages sent on clientTransport arrive at serverTransport's listener and vice versa.
 */
export function createLinkedTransports() {
  let clientListener: ((msg: unknown) => void) | null = null;
  let serverListener: ((msg: unknown) => void) | null = null;

  const clientTransport: RpcTransport = {
    send(message) {
      queueMicrotask(() => serverListener?.(message));
    },
    listen(handler) {
      clientListener = handler;
      return () => {
        clientListener = null;
      };
    },
  };

  const serverTransport: RpcTransport = {
    send(message) {
      queueMicrotask(() => clientListener?.(message));
    },
    listen(handler) {
      serverListener = handler;
      return () => {
        serverListener = null;
      };
    },
  };

  return { clientTransport, serverTransport };
}
