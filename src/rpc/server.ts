import mitt from "mitt";
import { getErrorMessage } from "../utils";
import type { RpcCalls, RpcChannelData } from "./calls";
import type { JsonRpcRequest, JsonRpcResponse } from "./types";

// jsonrpc 2 server for figma plugin

interface RpcServerEvents extends RpcChannelData {
  request: JsonRpcRequest<keyof RpcCalls, any>;
}

export class RpcServer {
  private emitter = mitt<RpcServerEvents>();

  constructor() {
    figma.ui.on("message", this.onMessage);
  }

  private onMessage = (event: JsonRpcRequest<keyof RpcCalls, any>) => {
    const req = event;
    if (req.method === "subscribe") {
      // this.emitter.emit(req.params.channel, req.params.data);
    } else {
      this.emitter.emit("request", req);
    }
  };

  handle<Method extends keyof RpcCalls>(
    method: Method,
    handler: (
      params: RpcCalls[Method]["req"]["params"]
    ) => Promise<RpcCalls[Method]["res"]["result"]>
  ) {
    this.emitter.on("request", async (req) => {
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
