import mitt from "mitt";
import { createIdGenerator } from "../utils";
import type { RpcCalls, RpcChannelData } from "./calls";
import type { JsonRpcResponse, RpcCallParams } from "./types";

interface RpcClientEvents extends RpcChannelData {
  response: JsonRpcResponse;
}

export class RpcClient {
  private emitter = mitt<RpcClientEvents>();
  private idGenerator = createIdGenerator();

  constructor() {
    window.addEventListener("message", this.onMessage);
  }

  private onMessage = (event: MessageEvent) => {
    console.log("onMessage client", event);
    const res = event.data.pluginMessage;
    if (res.method === "subscription") {
      this.emitter.emit(res.params.channel, res.params.data);
    } else {
      this.emitter.emit("response", res);
    }
  };

  private getId() {
    return this.idGenerator.next().value;
  }

  async call<Method extends keyof RpcCalls>(
    method: Method,
    ...args: RpcCallParams<Method>
  ): Promise<RpcCalls[Method]["res"]["result"]> {
    const params = args[0];
    const id = this.getId();
    const req = {
      jsonrpc: "2.0",
      id,
      method,
      params,
    };
    parent.postMessage(
      {
        pluginMessage: req,
        pluginId: "1206013659177640379",
      },
      "*"
    );

    return new Promise((resolve, reject) => {
      const handler = (res: JsonRpcResponse) => {
        if (res.id !== id) return;
        if (res.error) {
          reject(res.error);
        } else {
          resolve(res.result as any);
        }
        this.emitter.off("response", handler);
      };
      this.emitter.on("response", handler);
    });
  }

  subscribe<Channel extends keyof RpcChannelData>(
    channel: Channel | Channel[],
    handler: (data: RpcChannelData[Channel]) => void
  ) {
    const channels = Array.isArray(channel) ? channel : [channel];

    this.call("subscribe", {
      channels,
    });

    channels.forEach((channel) => {
      this.on(channel, handler);
    });

    return () => {
      this.call("unsubscribe", {
        channels,
      }).then(() => {
        channels.forEach((channel) => {
          this.off(channel, handler);
        });
      });
    };
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

  once<Channel extends keyof RpcChannelData>(
    channel: Channel,
    handler: (data: RpcChannelData[Channel]) => void
  ) {
    const onceHandler = (data: RpcChannelData[Channel]) => {
      handler(data);
      this.emitter.off(channel, onceHandler);
    };
    this.emitter.on(channel, onceHandler);
  }

  destroy() {
    this.emitter.all.clear();
    window?.removeEventListener("message", this.onMessage);
  }
}

export const rpcClient = new RpcClient();
