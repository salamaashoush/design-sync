import type { TokenSet } from "../types";
import type { JsonRpcCall } from "./types";

export interface RpcChannelData {
  "selection-changed": {
    selection: string[];
  };
}

export interface RpcCalls {
  subscribe: JsonRpcCall<"subscribe", { channels: (keyof RpcChannelData)[] }>;

  unsubscribe: JsonRpcCall<
    "unsubscribe",
    { channels: (keyof RpcChannelData)[] }
  >;
  "token-sets/get": JsonRpcCall<
    "token-sets/get",
    void,
    {
      sets: TokenSet[];
    }
  >;
}
