import { JsonRpcSubscribeRequest, JsonRpcUnsubscribeRequest } from "./calls";
import { JsonRpcObject, JsonRpcRequest, JsonRpcResponse, JsonRpcSubscription } from "./types";

export function isJsonRpcObject(value: unknown): value is JsonRpcObject {
  return (
    typeof value === "object" && value !== null && "jsonrpc" in value && value.jsonrpc === "2.0"
  );
}
export function isJsonRpcResponse(value: unknown): value is JsonRpcResponse {
  return isJsonRpcObject(value) && ("result" in value || "error" in value) && "id" in value;
}

export function isJsonRpcError(value: unknown): value is JsonRpcResponse {
  return isJsonRpcObject(value) && "error" in value && "id" in value;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isJsonRpcSubscription(value: unknown): value is JsonRpcSubscription<any> {
  return (
    isJsonRpcObject(value) &&
    "method" in value &&
    value.method === "subscription" &&
    "params" in value
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isJsonRpcRequest(value: unknown): value is JsonRpcRequest<any, any> {
  return isJsonRpcObject(value) && "id" in value && "method" in value && "params" in value;
}

export function isJsonRpcSubscribeRequest(value: unknown): value is JsonRpcSubscribeRequest {
  return isJsonRpcRequest(value) && value.method === "subscribe" && "channels" in value.params;
}

export function isJsonRpcUnsubscribeRequest(value: unknown): value is JsonRpcUnsubscribeRequest {
  return isJsonRpcRequest(value) && value.method === "unsubscribe" && "channels" in value.params;
}
