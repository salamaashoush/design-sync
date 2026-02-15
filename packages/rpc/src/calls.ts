import type { JsonRpcCall } from "./types";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface RpcChannelData {}
  interface RpcCalls {
    subscribe: JsonRpcCall<"subscribe", { channels: (keyof RpcChannelData)[] }>;
    unsubscribe: JsonRpcCall<"unsubscribe", { channels: (keyof RpcChannelData)[] }>;
  }
}

export type JsonRpcSubscribeRequest = RpcCalls["subscribe"]["req"];
export type JsonRpcUnsubscribeRequest = RpcCalls["unsubscribe"]["req"];
export type RpcCallParam<Method extends keyof RpcCalls> = RpcCalls[Method]["req"]["params"];
export type RpcCallParams<Method extends keyof RpcCalls> = RpcCalls[Method]["req"]["params"] extends
  | void
  | undefined
  ? []
  : [RpcCalls[Method]["req"]["params"]];

export type RpcCallResult<Method extends keyof RpcCalls> = RpcCalls[Method]["res"]["result"];
