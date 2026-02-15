export const RPC_ERROR_CODES = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
  SERVER_ERROR: -32000,
  TIMEOUT: -32001,
} as const;

export class RpcError extends Error {
  readonly code: number;
  readonly data?: unknown;

  constructor(message: string, code: number, data?: unknown) {
    super(message);
    this.name = "RpcError";
    this.code = code;
    this.data = data;
  }
}

export class RpcTimeoutError extends RpcError {
  readonly method: string;

  constructor(method: string, timeoutMs: number) {
    super(`RPC call "${method}" timed out after ${timeoutMs}ms`, RPC_ERROR_CODES.TIMEOUT);
    this.name = "RpcTimeoutError";
    this.method = method;
  }
}
