import { describe, expect, it } from "bun:test";
import {
  isJsonRpcError,
  isJsonRpcObject,
  isJsonRpcRequest,
  isJsonRpcResponse,
  isJsonRpcSubscribeRequest,
  isJsonRpcSubscription,
  isJsonRpcUnsubscribeRequest,
} from "../src/utils";

describe("isJsonRpcObject", () => {
  it("returns true for valid JSON-RPC 2.0 objects", () => {
    expect(isJsonRpcObject({ jsonrpc: "2.0", id: 1, method: "test", params: {} })).toBe(true);
    expect(isJsonRpcObject({ jsonrpc: "2.0", id: 1, result: "ok" })).toBe(true);
    expect(isJsonRpcObject({ jsonrpc: "2.0", method: "subscription", params: {} })).toBe(true);
  });

  it("returns false for null and undefined", () => {
    expect(isJsonRpcObject(null)).toBe(false);
    expect(isJsonRpcObject(undefined)).toBe(false);
  });

  it("returns false for non-objects", () => {
    expect(isJsonRpcObject("string")).toBe(false);
    expect(isJsonRpcObject(42)).toBe(false);
    expect(isJsonRpcObject(true)).toBe(false);
  });

  it("returns false without jsonrpc field", () => {
    expect(isJsonRpcObject({ id: 1, result: "ok" })).toBe(false);
  });

  it("returns false for wrong jsonrpc version", () => {
    expect(isJsonRpcObject({ jsonrpc: "1.0", id: 1, result: "ok" })).toBe(false);
    expect(isJsonRpcObject({ jsonrpc: "3.0", id: 1, result: "ok" })).toBe(false);
  });
});

describe("isJsonRpcResponse", () => {
  it("returns true for response with result", () => {
    expect(isJsonRpcResponse({ jsonrpc: "2.0", id: 1, result: "ok" })).toBe(true);
  });

  it("returns true for response with null result", () => {
    expect(isJsonRpcResponse({ jsonrpc: "2.0", id: 1, result: null })).toBe(true);
  });

  it("returns true for response with error only", () => {
    expect(
      isJsonRpcResponse({
        jsonrpc: "2.0",
        id: 1,
        error: { code: -32000, message: "fail" },
      }),
    ).toBe(true);
  });

  it("returns true for response with both result and error", () => {
    expect(
      isJsonRpcResponse({
        jsonrpc: "2.0",
        id: 1,
        result: null,
        error: { code: -32000, message: "fail" },
      }),
    ).toBe(true);
  });

  it("returns false without id", () => {
    expect(isJsonRpcResponse({ jsonrpc: "2.0", result: "ok" })).toBe(false);
  });

  it("returns false for a request (has method instead of result/error)", () => {
    expect(isJsonRpcResponse({ jsonrpc: "2.0", id: 1, method: "test", params: {} })).toBe(false);
  });
});

describe("isJsonRpcError", () => {
  it("returns true for error response", () => {
    expect(
      isJsonRpcError({
        jsonrpc: "2.0",
        id: 1,
        error: { code: -32000, message: "fail" },
      }),
    ).toBe(true);
  });

  it("returns false for success response (no error field)", () => {
    expect(isJsonRpcError({ jsonrpc: "2.0", id: 1, result: "ok" })).toBe(false);
  });
});

describe("isJsonRpcSubscription", () => {
  it("returns true for valid subscription", () => {
    expect(
      isJsonRpcSubscription({
        jsonrpc: "2.0",
        method: "subscription",
        params: { channel: "updates", data: { value: 1 } },
      }),
    ).toBe(true);
  });

  it("returns false for non-subscription method", () => {
    expect(
      isJsonRpcSubscription({
        jsonrpc: "2.0",
        method: "other",
        params: {},
      }),
    ).toBe(false);
  });

  it("returns false without params", () => {
    expect(
      isJsonRpcSubscription({
        jsonrpc: "2.0",
        method: "subscription",
      }),
    ).toBe(false);
  });
});

describe("isJsonRpcRequest", () => {
  it("returns true for valid request", () => {
    expect(isJsonRpcRequest({ jsonrpc: "2.0", id: 1, method: "echo", params: {} })).toBe(true);
  });

  it("returns true for request with complex params", () => {
    expect(
      isJsonRpcRequest({
        jsonrpc: "2.0",
        id: 42,
        method: "add",
        params: { a: 1, b: 2 },
      }),
    ).toBe(true);
  });

  it("returns false for response", () => {
    expect(isJsonRpcRequest({ jsonrpc: "2.0", id: 1, result: "ok" })).toBe(false);
  });

  it("returns false without method", () => {
    expect(isJsonRpcRequest({ jsonrpc: "2.0", id: 1, params: {} })).toBe(false);
  });

  it("returns false without params", () => {
    expect(isJsonRpcRequest({ jsonrpc: "2.0", id: 1, method: "test" })).toBe(false);
  });

  it("returns false without id", () => {
    expect(isJsonRpcRequest({ jsonrpc: "2.0", method: "test", params: {} })).toBe(false);
  });
});

describe("isJsonRpcSubscribeRequest", () => {
  it("returns true for subscribe request", () => {
    expect(
      isJsonRpcSubscribeRequest({
        jsonrpc: "2.0",
        id: 1,
        method: "subscribe",
        params: { channels: ["updates"] },
      }),
    ).toBe(true);
  });

  it("returns false for unsubscribe request", () => {
    expect(
      isJsonRpcSubscribeRequest({
        jsonrpc: "2.0",
        id: 1,
        method: "unsubscribe",
        params: { channels: ["updates"] },
      }),
    ).toBe(false);
  });

  it("returns false for other methods", () => {
    expect(
      isJsonRpcSubscribeRequest({
        jsonrpc: "2.0",
        id: 1,
        method: "echo",
        params: { message: "hi" },
      }),
    ).toBe(false);
  });

  it("returns false without channels in params", () => {
    expect(
      isJsonRpcSubscribeRequest({
        jsonrpc: "2.0",
        id: 1,
        method: "subscribe",
        params: {},
      }),
    ).toBe(false);
  });
});

describe("isJsonRpcUnsubscribeRequest", () => {
  it("returns true for unsubscribe request", () => {
    expect(
      isJsonRpcUnsubscribeRequest({
        jsonrpc: "2.0",
        id: 1,
        method: "unsubscribe",
        params: { channels: ["updates"] },
      }),
    ).toBe(true);
  });

  it("returns false for subscribe request", () => {
    expect(
      isJsonRpcUnsubscribeRequest({
        jsonrpc: "2.0",
        id: 1,
        method: "subscribe",
        params: { channels: ["updates"] },
      }),
    ).toBe(false);
  });

  it("returns false for other methods", () => {
    expect(
      isJsonRpcUnsubscribeRequest({
        jsonrpc: "2.0",
        id: 1,
        method: "echo",
        params: { message: "hi" },
      }),
    ).toBe(false);
  });
});
