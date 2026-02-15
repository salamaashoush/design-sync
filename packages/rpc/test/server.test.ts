import { afterEach, describe, expect, it } from "bun:test";
import { RPC_ERROR_CODES } from "../src/errors";
import { RpcServer } from "../src/server";
import { createMockTransport } from "./helpers";

describe("RpcServer", () => {
  let transport: ReturnType<typeof createMockTransport>;
  let server: RpcServer;

  afterEach(() => {
    server?.destroy();
  });

  // Helper to wait for async dispatch to complete
  const tick = () => new Promise((r) => setTimeout(r, 10));

  describe("constructor", () => {
    it("registers a listener on the transport", () => {
      transport = createMockTransport();
      server = new RpcServer(transport.transport);
      expect(transport.hasListener).toBe(true);
    });
  });

  describe("handle", () => {
    it("responds to registered method with result", async () => {
      transport = createMockTransport();
      server = new RpcServer(transport.transport);

      server.handle("echo", async (params) => params.message);

      transport.receive({
        jsonrpc: "2.0",
        id: 1,
        method: "echo",
        params: { message: "hello" },
      });
      await tick();

      expect(transport.sent).toHaveLength(1);
      expect(transport.sent[0]).toEqual({
        jsonrpc: "2.0",
        id: 1,
        result: "hello",
      });
    });

    it("responds with computed result", async () => {
      transport = createMockTransport();
      server = new RpcServer(transport.transport);

      server.handle("add", async (params) => params.a + params.b);

      transport.receive({
        jsonrpc: "2.0",
        id: 5,
        method: "add",
        params: { a: 10, b: 32 },
      });
      await tick();

      expect(transport.sent).toHaveLength(1);
      expect((transport.sent[0] as any).id).toBe(5);
      expect((transport.sent[0] as any).result).toBe(42);
    });

    it("responds with undefined result for void handlers", async () => {
      transport = createMockTransport();
      server = new RpcServer(transport.transport);

      server.handle("noop", async () => undefined);

      transport.receive({
        jsonrpc: "2.0",
        id: 1,
        method: "noop",
        params: undefined,
      });
      await tick();

      expect(transport.sent).toHaveLength(1);
      expect((transport.sent[0] as any).result).toBeUndefined();
    });

    it("responds with SERVER_ERROR when handler throws", async () => {
      transport = createMockTransport();
      server = new RpcServer(transport.transport);

      server.handle("echo", async () => {
        throw new Error("handler failed");
      });

      transport.receive({
        jsonrpc: "2.0",
        id: 1,
        method: "echo",
        params: { message: "hello" },
      });
      await tick();

      expect(transport.sent).toHaveLength(1);
      const response = transport.sent[0] as any;
      expect(response.id).toBe(1);
      expect(response.error).toBeDefined();
      expect(response.error.code).toBe(RPC_ERROR_CODES.SERVER_ERROR);
      expect(response.error.message).toBe("handler failed");
    });

    it("responds with SERVER_ERROR for non-Error throws", async () => {
      transport = createMockTransport();
      server = new RpcServer(transport.transport);

      server.handle("echo", async () => {
        throw "string error";
      });

      transport.receive({
        jsonrpc: "2.0",
        id: 1,
        method: "echo",
        params: { message: "hello" },
      });
      await tick();

      const response = transport.sent[0] as any;
      expect(response.error.code).toBe(RPC_ERROR_CODES.SERVER_ERROR);
      expect(response.error.message).toBe("string error");
    });

    it("replaces handler when registering same method twice", async () => {
      transport = createMockTransport();
      server = new RpcServer(transport.transport);

      server.handle("echo", async () => "first");
      server.handle("echo", async () => "second");

      transport.receive({
        jsonrpc: "2.0",
        id: 1,
        method: "echo",
        params: { message: "hello" },
      });
      await tick();

      expect(transport.sent).toHaveLength(1);
      expect((transport.sent[0] as any).result).toBe("second");
    });

    it("handles multiple different methods", async () => {
      transport = createMockTransport();
      server = new RpcServer(transport.transport);

      server.handle("echo", async (params) => params.message);
      server.handle("add", async (params) => params.a + params.b);

      transport.receive({ jsonrpc: "2.0", id: 1, method: "echo", params: { message: "hi" } });
      transport.receive({ jsonrpc: "2.0", id: 2, method: "add", params: { a: 3, b: 4 } });
      await tick();

      expect(transport.sent).toHaveLength(2);
      expect((transport.sent[0] as any).result).toBe("hi");
      expect((transport.sent[1] as any).result).toBe(7);
    });
  });

  describe("unregistered methods", () => {
    it("responds with METHOD_NOT_FOUND for unknown methods", async () => {
      transport = createMockTransport();
      server = new RpcServer(transport.transport);

      transport.receive({
        jsonrpc: "2.0",
        id: 1,
        method: "unknown",
        params: {},
      });
      await tick();

      expect(transport.sent).toHaveLength(1);
      const response = transport.sent[0] as any;
      expect(response.id).toBe(1);
      expect(response.error.code).toBe(RPC_ERROR_CODES.METHOD_NOT_FOUND);
      expect(response.error.message).toContain("unknown");
    });
  });

  describe("subscribe / unsubscribe", () => {
    it("responds to subscribe request (fixes deadlock)", () => {
      transport = createMockTransport();
      server = new RpcServer(transport.transport);

      transport.receive({
        jsonrpc: "2.0",
        id: 1,
        method: "subscribe",
        params: { channels: ["updates"] },
      });

      // Response should be sent synchronously
      expect(transport.sent).toHaveLength(1);
      expect(transport.sent[0]).toEqual({
        jsonrpc: "2.0",
        id: 1,
        result: true,
      });
    });

    it("responds to unsubscribe request", () => {
      transport = createMockTransport();
      server = new RpcServer(transport.transport);

      transport.receive({
        jsonrpc: "2.0",
        id: 1,
        method: "unsubscribe",
        params: { channels: ["updates"] },
      });

      expect(transport.sent).toHaveLength(1);
      expect(transport.sent[0]).toEqual({
        jsonrpc: "2.0",
        id: 1,
        result: true,
      });
    });

    it("handles subscribe with multiple channels", () => {
      transport = createMockTransport();
      server = new RpcServer(transport.transport);

      transport.receive({
        jsonrpc: "2.0",
        id: 1,
        method: "subscribe",
        params: { channels: ["updates", "notifications"] },
      });

      expect(transport.sent).toHaveLength(1);
      expect((transport.sent[0] as any).result).toBe(true);
    });
  });

  describe("emit", () => {
    it("sends subscription events to subscribed channels", () => {
      transport = createMockTransport();
      server = new RpcServer(transport.transport);

      // Subscribe
      transport.receive({
        jsonrpc: "2.0",
        id: 1,
        method: "subscribe",
        params: { channels: ["updates"] },
      });
      transport.sent.length = 0;

      server.emit("updates", { value: 42 });

      expect(transport.sent).toHaveLength(1);
      expect(transport.sent[0]).toEqual({
        jsonrpc: "2.0",
        method: "subscription",
        params: { channel: "updates", data: { value: 42 } },
      });
    });

    it("does not send before subscribe", () => {
      transport = createMockTransport();
      server = new RpcServer(transport.transport);

      server.emit("updates", { value: 42 });

      expect(transport.sent).toHaveLength(0);
    });

    it("stops sending after unsubscribe", () => {
      transport = createMockTransport();
      server = new RpcServer(transport.transport);

      transport.receive({
        jsonrpc: "2.0",
        id: 1,
        method: "subscribe",
        params: { channels: ["updates"] },
      });
      transport.receive({
        jsonrpc: "2.0",
        id: 2,
        method: "unsubscribe",
        params: { channels: ["updates"] },
      });
      transport.sent.length = 0;

      server.emit("updates", { value: 42 });

      expect(transport.sent).toHaveLength(0);
    });

    it("only sends to subscribed channels", () => {
      transport = createMockTransport();
      server = new RpcServer(transport.transport);

      transport.receive({
        jsonrpc: "2.0",
        id: 1,
        method: "subscribe",
        params: { channels: ["updates"] },
      });
      transport.sent.length = 0;

      // Emit to a different, non-subscribed channel
      server.emit("notifications", { text: "hello" });

      expect(transport.sent).toHaveLength(0);
    });

    it("sends multiple events", () => {
      transport = createMockTransport();
      server = new RpcServer(transport.transport);

      transport.receive({
        jsonrpc: "2.0",
        id: 1,
        method: "subscribe",
        params: { channels: ["updates"] },
      });
      transport.sent.length = 0;

      server.emit("updates", { value: 1 });
      server.emit("updates", { value: 2 });
      server.emit("updates", { value: 3 });

      expect(transport.sent).toHaveLength(3);
    });
  });

  describe("removeHandler", () => {
    it("removed method returns METHOD_NOT_FOUND", async () => {
      transport = createMockTransport();
      server = new RpcServer(transport.transport);

      server.handle("echo", async (params) => params.message);
      server.removeHandler("echo");

      transport.receive({
        jsonrpc: "2.0",
        id: 1,
        method: "echo",
        params: { message: "hello" },
      });
      await tick();

      expect(transport.sent).toHaveLength(1);
      expect((transport.sent[0] as any).error.code).toBe(RPC_ERROR_CODES.METHOD_NOT_FOUND);
    });

    it("does not affect other handlers", async () => {
      transport = createMockTransport();
      server = new RpcServer(transport.transport);

      server.handle("echo", async (params) => params.message);
      server.handle("add", async (params) => params.a + params.b);
      server.removeHandler("echo");

      transport.receive({
        jsonrpc: "2.0",
        id: 1,
        method: "add",
        params: { a: 1, b: 2 },
      });
      await tick();

      expect(transport.sent).toHaveLength(1);
      expect((transport.sent[0] as any).result).toBe(3);
    });
  });

  describe("destroy", () => {
    it("removes the transport listener", () => {
      transport = createMockTransport();
      server = new RpcServer(transport.transport);
      expect(transport.hasListener).toBe(true);

      server.destroy();
      expect(transport.hasListener).toBe(false);
    });

    it("is safe to call destroy multiple times", () => {
      transport = createMockTransport();
      server = new RpcServer(transport.transport);

      server.destroy();
      server.destroy(); // Should not throw
    });
  });

  describe("ignores non-JSON-RPC messages", () => {
    it("ignores plain strings", () => {
      transport = createMockTransport();
      server = new RpcServer(transport.transport);

      transport.receive("not json-rpc");
      expect(transport.sent).toHaveLength(0);
    });

    it("ignores null", () => {
      transport = createMockTransport();
      server = new RpcServer(transport.transport);

      transport.receive(null);
      expect(transport.sent).toHaveLength(0);
    });

    it("ignores objects without jsonrpc field", () => {
      transport = createMockTransport();
      server = new RpcServer(transport.transport);

      transport.receive({ id: 1, method: "echo", params: {} });
      expect(transport.sent).toHaveLength(0);
    });

    it("ignores JSON-RPC responses (only handles requests)", () => {
      transport = createMockTransport();
      server = new RpcServer(transport.transport);

      transport.receive({ jsonrpc: "2.0", id: 1, result: "ok" });
      expect(transport.sent).toHaveLength(0);
    });
  });
});
