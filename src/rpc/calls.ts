import type { Token, TokenSet } from "../types";
import type { JsonRpcCall } from "./types";

export interface RpcChannelData {
  selectionchange: {
    selection: string[];
  };
}

export interface RpcCalls {
  subscribe: JsonRpcCall<"subscribe", { channels: (keyof RpcChannelData)[] }>;
  unsubscribe: JsonRpcCall<
    "unsubscribe",
    { channels: (keyof RpcChannelData)[] }
  >;
  "tokens/get": JsonRpcCall<
    "tokens/get",
    void,
    {
      sets: TokenSet[];
    }
  >;
  "tokens/apply": JsonRpcCall<
    "tokens/apply",
    {
      target: "selection" | "document" | "page";
      path: string;
      token: Token;
    }
  >;
  resize: JsonRpcCall<
    "resize",
    {
      width: number;
      height: number;
    }
  >;
}

export type JsonRpcSubscribeRequest = RpcCalls["subscribe"]["req"];
export type JsonRpcUnsubscribeRequest = RpcCalls["unsubscribe"]["req"];
export type RpcCallParam<Method extends keyof RpcCalls> =
  RpcCalls[Method]["req"]["params"];

export type RpcCallParams<Method extends keyof RpcCalls> =
  RpcCalls[Method]["req"]["params"] extends void | undefined
    ? []
    : [RpcCalls[Method]["req"]["params"]];
