import { getErrorMessage } from "@design-sync/utils";
import mitt from "mitt";
import { RPC_ERROR_CODES } from "./errors";
import type { RpcTransport } from "./transport";
import type { JsonRpcRequest, JsonRpcResponse } from "./types";
import { isJsonRpcRequest, isJsonRpcSubscribeRequest, isJsonRpcUnsubscribeRequest } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RequestHandler = (params: any) => Promise<any>;

export class RpcServer {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore-next-line
  private emitter = mitt<RpcChannelData>();
  private channels = new Set<keyof RpcChannelData>();
  private handlers = new Map<string, RequestHandler>();
  private unlisten: (() => void) | null = null;

  constructor(private transport: RpcTransport) {
    this.unlisten = this.transport.listen(this.onMessage);
  }

  private sendResponse(id: number, result?: unknown, error?: JsonRpcResponse["error"]) {
    const res: JsonRpcResponse = { jsonrpc: "2.0", id };
    if (error) {
      res.error = error;
    } else {
      res.result = result;
    }
    this.transport.send(res);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private onMessage = (message: unknown) => {
    if (isJsonRpcSubscribeRequest(message)) {
      for (const ch of message.params.channels) {
        this.channels.add(ch);
      }
      this.sendResponse(message.id, true);
      return;
    }

    if (isJsonRpcUnsubscribeRequest(message)) {
      for (const ch of message.params.channels) {
        this.channels.delete(ch);
      }
      this.sendResponse(message.id, true);
      return;
    }

    if (isJsonRpcRequest(message)) {
      this.dispatch(message);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async dispatch(req: JsonRpcRequest<any, any>) {
    const handler = this.handlers.get(req.method);
    if (!handler) {
      this.sendResponse(req.id, undefined, {
        code: RPC_ERROR_CODES.METHOD_NOT_FOUND,
        message: `Method "${req.method}" not found`,
      });
      return;
    }

    try {
      const result = await handler(req.params);
      this.sendResponse(req.id, result);
    } catch (error) {
      this.sendResponse(req.id, undefined, {
        code: RPC_ERROR_CODES.SERVER_ERROR,
        message: getErrorMessage(error),
        data: error,
      });
    }
  }

  handle<Method extends keyof RpcCalls>(
    method: Method,
    handler: (
      params: RpcCalls[Method]["req"]["params"],
    ) => Promise<RpcCalls[Method]["res"]["result"]>,
  ) {
    this.handlers.set(method, handler as RequestHandler);
  }

  removeHandler<Method extends keyof RpcCalls>(method: Method) {
    this.handlers.delete(method);
  }

  emit<Channel extends keyof RpcChannelData>(channel: Channel, data: RpcChannelData[Channel]) {
    if (!this.channels.has(channel)) return;
    this.transport.send({
      jsonrpc: "2.0",
      method: "subscription",
      params: {
        channel,
        data,
      },
    });
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

  destroy() {
    this.handlers.clear();
    this.emitter.all.clear();
    this.unlisten?.();
    this.unlisten = null;
  }
}
