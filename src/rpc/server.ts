import mitt from "mitt";
import { getErrorMessage } from "../utils";
import type { RpcCalls, RpcChannelData } from "./calls";
import type { JsonRpcResponse } from "./types";
import {
  isJsonRpcRequest,
  isJsonRpcSubscribeRequest,
  isJsonRpcUnsubscribeRequest,
} from "./utils";

// jsonrpc 2 server for figma plugin

type RpcServerRequests = {
  [Method in keyof RpcCalls]: RpcCalls[Method]["req"];
};
interface RpcServerEvents extends RpcChannelData, RpcServerRequests {}

export class RpcServer {
  private emitter = mitt<RpcServerEvents>();
  private channels = new Set<keyof RpcChannelData>();
  constructor() {
    figma.ui.on("message", this.onMessage);
  }

  private onMessage = (req: unknown) => {
    if (isJsonRpcSubscribeRequest(req)) {
      for (const ch of req.params.channels) {
        this.channels.add(ch);
      }
      return;
    }

    if (isJsonRpcUnsubscribeRequest(req)) {
      for (const ch of req.params.channels) {
        this.channels.delete(ch);
      }
      return;
    }

    if (isJsonRpcRequest(req)) {
      this.emitter.emit(req.method, req);
    }
  };

  handle<Method extends keyof RpcCalls>(
    method: Method,
    handler: (
      params: RpcCalls[Method]["req"]["params"]
    ) => Promise<RpcCalls[Method]["res"]["result"]>
  ) {
    this.emitter.on(method, async (req) => {
      if (req.method !== method) return;
      try {
        const res = await handler(req.params);
        figma.ui.postMessage(
          {
            jsonrpc: "2.0",
            id: req.id,
            result: res,
          },
          {
            origin: "*",
          }
        );
      } catch (error) {
        const res: JsonRpcResponse = {
          jsonrpc: "2.0",
          id: req.id,
          result: undefined,
          error: {
            code: -32000,
            message: getErrorMessage(error),
            data: error,
          },
        };

        figma.ui.postMessage(res, {
          origin: "*",
        });
      }
    });
  }

  emit<Channel extends keyof RpcChannelData>(
    channel: Channel,
    data: RpcChannelData[Channel]
  ) {
    if (!this.channels.has(channel)) return;
    figma.ui.postMessage(
      {
        jsonrpc: "2.0",
        method: "subscribe",
        params: {
          channel,
          data,
        },
      },
      {
        origin: "*",
      }
    );
  }

  on<Channel extends keyof RpcChannelData>(
    channel: Channel,
    handler: (data: RpcChannelData[Channel]) => void
  ) {
    this.emitter.on(channel, handler);
  }

  off<Channel extends keyof RpcChannelData>(
    channel: Channel,
    handler: (data: RpcChannelData[Channel]) => void
  ) {
    this.emitter.off(channel, handler);
  }

  destroy() {
    this.emitter.all.clear();
    figma.ui.off("message", this.onMessage);
  }
}

export const rpcServer = new RpcServer();
