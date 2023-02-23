import { RpcCalls } from "./calls";

export type JsonRpcData = unknown;
export interface JsonRpcRequest<
  Method extends string,
  Params extends JsonRpcData = JsonRpcData
> {
  jsonrpc: "2.0";
  id: number;
  method: Method;
  params: Params;
}

export type JsonRpcResponse<
  Results extends JsonRpcData = JsonRpcData,
  ErrorData extends JsonRpcData = JsonRpcData
> = {
  jsonrpc: "2.0";
  id: number;
  result?: Results;
  error?: {
    code: number;
    message: string;
    data?: ErrorData;
  };
};

export interface JsonRpcCall<
  Method extends string,
  Params extends JsonRpcData = JsonRpcData,
  Results extends JsonRpcData = JsonRpcData
> {
  req: JsonRpcRequest<Method, Params>;
  res: JsonRpcResponse<Results>;
}

export interface JsonRpcSubscriptionData<
  Channel extends string,
  Data extends JsonRpcData = JsonRpcData
> {
  channel: Channel;
  data: Data;
}
export interface JsonRpcSubscription<
  Channel extends string,
  Data extends JsonRpcData = JsonRpcData
> {
  jsonrpc: "2.0";
  method: "subscription";
  params: JsonRpcSubscriptionData<Channel, Data>;
}

export type RpcCallParams<Method extends keyof RpcCalls> =
  RpcCalls[Method]["req"]["params"] extends void | undefined
    ? []
    : [RpcCalls[Method]["req"]["params"]];
