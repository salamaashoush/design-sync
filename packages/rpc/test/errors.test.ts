import { describe, expect, it } from "bun:test";
import { RPC_ERROR_CODES, RpcError, RpcTimeoutError } from "../src/errors";

describe("RpcError", () => {
  it("extends Error", () => {
    const err = new RpcError("test", -32000);
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(RpcError);
  });

  it("has correct name, message, and code", () => {
    const err = new RpcError("something failed", -32000);
    expect(err.name).toBe("RpcError");
    expect(err.message).toBe("something failed");
    expect(err.code).toBe(-32000);
  });

  it("stores optional data", () => {
    const data = { detail: "extra info" };
    const err = new RpcError("fail", -32000, data);
    expect(err.data).toEqual(data);
  });

  it("data is undefined when not provided", () => {
    const err = new RpcError("fail", -32000);
    expect(err.data).toBeUndefined();
  });

  it("has a stack trace", () => {
    const err = new RpcError("fail", -32000);
    expect(err.stack).toBeDefined();
    expect(err.stack).toContain("RpcError");
  });
});

describe("RpcTimeoutError", () => {
  it("extends both RpcError and Error", () => {
    const err = new RpcTimeoutError("echo", 5000);
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(RpcError);
    expect(err).toBeInstanceOf(RpcTimeoutError);
  });

  it("has correct name and method", () => {
    const err = new RpcTimeoutError("echo", 5000);
    expect(err.name).toBe("RpcTimeoutError");
    expect(err.method).toBe("echo");
  });

  it("uses TIMEOUT error code", () => {
    const err = new RpcTimeoutError("echo", 5000);
    expect(err.code).toBe(RPC_ERROR_CODES.TIMEOUT);
  });

  it("formats message with method and timeout", () => {
    const err = new RpcTimeoutError("echo", 5000);
    expect(err.message).toBe('RPC call "echo" timed out after 5000ms');
  });
});

describe("RPC_ERROR_CODES", () => {
  it("has standard JSON-RPC 2.0 error codes", () => {
    expect(RPC_ERROR_CODES.PARSE_ERROR).toBe(-32700);
    expect(RPC_ERROR_CODES.INVALID_REQUEST).toBe(-32600);
    expect(RPC_ERROR_CODES.METHOD_NOT_FOUND).toBe(-32601);
    expect(RPC_ERROR_CODES.INVALID_PARAMS).toBe(-32602);
    expect(RPC_ERROR_CODES.INTERNAL_ERROR).toBe(-32603);
  });

  it("has custom error codes", () => {
    expect(RPC_ERROR_CODES.SERVER_ERROR).toBe(-32000);
    expect(RPC_ERROR_CODES.TIMEOUT).toBe(-32001);
  });
});
