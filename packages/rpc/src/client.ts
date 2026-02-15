import { createIdGenerator } from "@design-sync/utils";
import mitt from "mitt";
import type { RpcCallParams } from "./calls";
import { RpcError, RpcTimeoutError } from "./errors";
import type { RpcTransport } from "./transport";
import { isJsonRpcResponse, isJsonRpcSubscription } from "./utils";

const DEFAULT_TIMEOUT_MS = 30_000;

export interface RpcClientOptions {
  timeout?: number;
}

interface PendingCall {
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
  timer: ReturnType<typeof setTimeout>;
  method: string;
}

export class RpcClient {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore-next-line
  private emitter = mitt<RpcChannelData>();
  private idGenerator = createIdGenerator();
  private pending = new Map<number, PendingCall>();
  private unlisten: (() => void) | null = null;
  private timeoutMs: number;

  constructor(
    private transport: RpcTransport,
    options?: RpcClientOptions,
  ) {
    this.timeoutMs = options?.timeout ?? DEFAULT_TIMEOUT_MS;
    this.unlisten = this.transport.listen(this.onMessage);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private onMessage = (message: unknown) => {
    if (isJsonRpcSubscription(message)) {
      (this.emitter.emit as any)(message.params.channel, message.params.data);
      return;
    }

    if (isJsonRpcResponse(message)) {
      const pending = this.pending.get(message.id);
      if (!pending) return;
      clearTimeout(pending.timer);
      this.pending.delete(message.id);

      if (message.error) {
        pending.reject(new RpcError(message.error.message, message.error.code, message.error.data));
      } else {
        pending.resolve(message.result);
      }
    }
  };

  private getId(): number {
    return this.idGenerator.next().value as number;
  }

  async call<Method extends keyof RpcCalls>(
    method: Method,
    ...args: RpcCallParams<Method>
  ): Promise<RpcCalls[Method]["res"]["result"]> {
    const params = args[0];
    const id = this.getId();

    this.transport.send({
      jsonrpc: "2.0",
      id,
      method,
      params,
    });

    return new Promise<RpcCalls[Method]["res"]["result"]>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new RpcTimeoutError(method, this.timeoutMs));
      }, this.timeoutMs);

      this.pending.set(id, {
        resolve: resolve as (value: unknown) => void,
        reject,
        timer,
        method,
      });
    });
  }

  async subscribe<Channel extends keyof RpcChannelData>(channel: Channel | Channel[]) {
    const channels = Array.isArray(channel) ? channel : [channel];

    await this.call("subscribe", {
      channels,
    });

    return () => {
      this.call("unsubscribe", {
        channels,
      });
    };
  }

  on<Channel extends keyof RpcChannelData>(
    channel: Channel,
    handler: (data: RpcChannelData[Channel]) => void,
  ) {
    this.emitter.on(channel, handler);
  }

  off<Channel extends keyof RpcChannelData>(
    channel: Channel,
    handler: (data: RpcChannelData[Channel]) => void,
  ) {
    this.emitter.off(channel, handler);
  }

  once<Channel extends keyof RpcChannelData>(
    channel: Channel,
    handler: (data: RpcChannelData[Channel]) => void,
  ) {
    const onceHandler = (data: RpcChannelData[Channel]) => {
      handler(data);
      this.emitter.off(channel, onceHandler);
    };
    this.emitter.on(channel, onceHandler);
  }

  destroy() {
    for (const [id, pending] of this.pending) {
      clearTimeout(pending.timer);
      pending.reject(new RpcError("Client destroyed", -32099));
      this.pending.delete(id);
    }
    this.emitter.all.clear();
    this.unlisten?.();
    this.unlisten = null;
  }
}
