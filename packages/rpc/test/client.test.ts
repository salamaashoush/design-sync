import { afterEach, describe, expect, it } from "bun:test";
import { RpcClient } from "../src/client";
import { RpcError, RpcTimeoutError } from "../src/errors";
import { createMockTransport } from "./helpers";

describe("RpcClient", () => {
  let transport: ReturnType<typeof createMockTransport>;
  let client: RpcClient;

  afterEach(() => {
    client?.destroy();
  });

  describe("constructor", () => {
    it("registers a listener on the transport", () => {
      transport = createMockTransport();
      client = new RpcClient(transport.transport);
      expect(transport.hasListener).toBe(true);
    });
  });

  describe("call", () => {
    it("sends a valid JSON-RPC 2.0 request", () => {
      transport = createMockTransport();
      client = new RpcClient(transport.transport);

      const promise = client.call("echo", { message: "hello" });

      expect(transport.sent).toHaveLength(1);
      expect(transport.sent[0]).toEqual({
        jsonrpc: "2.0",
        id: 1,
        method: "echo",
        params: { message: "hello" },
      });

      // Resolve to prevent timeout
      transport.receive({ jsonrpc: "2.0", id: 1, result: "hello" });
      return promise;
    });

    it("increments request IDs", () => {
      transport = createMockTransport();
      client = new RpcClient(transport.transport);

      const p1 = client.call("echo", { message: "1" });
      const p2 = client.call("echo", { message: "2" });
      const p3 = client.call("echo", { message: "3" });

      expect((transport.sent[0] as any).id).toBe(1);
      expect((transport.sent[1] as any).id).toBe(2);
      expect((transport.sent[2] as any).id).toBe(3);

      transport.receive({ jsonrpc: "2.0", id: 1, result: "1" });
      transport.receive({ jsonrpc: "2.0", id: 2, result: "2" });
      transport.receive({ jsonrpc: "2.0", id: 3, result: "3" });

      return Promise.all([p1, p2, p3]);
    });

    it("resolves with result on success response", async () => {
      transport = createMockTransport();
      client = new RpcClient(transport.transport);

      const promise = client.call("echo", { message: "hello" });
      transport.receive({ jsonrpc: "2.0", id: 1, result: "hello" });

      const result = await promise;
      expect(result).toBe("hello");
    });

    it("resolves with undefined result", async () => {
      transport = createMockTransport();
      client = new RpcClient(transport.transport);

      const promise = client.call("noop");
      transport.receive({ jsonrpc: "2.0", id: 1, result: undefined });

      const result = await promise;
      expect(result).toBeUndefined();
    });

    it("rejects with RpcError on error response", async () => {
      transport = createMockTransport();
      client = new RpcClient(transport.transport);

      const promise = client.call("echo", { message: "hello" });
      transport.receive({
        jsonrpc: "2.0",
        id: 1,
        error: { code: -32000, message: "Server error", data: { detail: "oops" } },
      });

      try {
        await promise;
        expect.unreachable("should have thrown");
      } catch (err) {
        expect(err).toBeInstanceOf(RpcError);
        expect(err).toBeInstanceOf(Error);
        const rpcErr = err as RpcError;
        expect(rpcErr.code).toBe(-32000);
        expect(rpcErr.message).toBe("Server error");
        expect(rpcErr.data).toEqual({ detail: "oops" });
      }
    });

    it("ignores responses with unknown IDs", async () => {
      transport = createMockTransport();
      client = new RpcClient(transport.transport);

      const promise = client.call("echo", { message: "hello" });

      // Wrong ID — should be silently ignored
      transport.receive({ jsonrpc: "2.0", id: 999, result: "wrong" });
      // Correct ID
      transport.receive({ jsonrpc: "2.0", id: 1, result: "correct" });

      const result = await promise;
      expect(result).toBe("correct");
    });

    it("ignores non-JSON-RPC messages", async () => {
      transport = createMockTransport();
      client = new RpcClient(transport.transport);

      const promise = client.call("echo", { message: "hello" });

      transport.receive("garbage");
      transport.receive(null);
      transport.receive({ not: "jsonrpc" });
      transport.receive({ jsonrpc: "2.0", id: 1, result: "ok" });

      const result = await promise;
      expect(result).toBe("ok");
    });

    it("rejects with RpcTimeoutError on timeout", async () => {
      transport = createMockTransport();
      client = new RpcClient(transport.transport, { timeout: 50 });

      try {
        await client.call("echo", { message: "hello" });
        expect.unreachable("should have thrown");
      } catch (err) {
        expect(err).toBeInstanceOf(RpcTimeoutError);
        expect(err).toBeInstanceOf(RpcError);
        expect(err).toBeInstanceOf(Error);
        const timeoutErr = err as RpcTimeoutError;
        expect(timeoutErr.method).toBe("echo");
        expect(timeoutErr.message).toContain("timed out");
      }
    });

    it("handles multiple concurrent calls resolved out of order", async () => {
      transport = createMockTransport();
      client = new RpcClient(transport.transport);

      const p1 = client.call("echo", { message: "first" });
      const p2 = client.call("add", { a: 1, b: 2 });
      const p3 = client.call("echo", { message: "third" });

      // Respond out of order
      transport.receive({ jsonrpc: "2.0", id: 3, result: "third" });
      transport.receive({ jsonrpc: "2.0", id: 1, result: "first" });
      transport.receive({ jsonrpc: "2.0", id: 2, result: 3 });

      const [r1, r2, r3] = await Promise.all([p1, p2, p3]);
      expect(r1).toBe("first");
      expect(r2).toBe(3);
      expect(r3).toBe("third");
    });

    it("clears timeout timer on successful response", async () => {
      transport = createMockTransport();
      client = new RpcClient(transport.transport, { timeout: 100 });

      const promise = client.call("echo", { message: "hello" });
      transport.receive({ jsonrpc: "2.0", id: 1, result: "hello" });

      const result = await promise;
      expect(result).toBe("hello");

      // If timer wasn't cleared, this would be flaky — wait past timeout to verify
      await new Promise((r) => setTimeout(r, 150));
    });
  });

  describe("subscribe", () => {
    it("sends a subscribe call and resolves", async () => {
      transport = createMockTransport();
      client = new RpcClient(transport.transport);

      const promise = client.subscribe("updates");
      transport.receive({ jsonrpc: "2.0", id: 1, result: true });

      const unsubscribe = await promise;
      expect(typeof unsubscribe).toBe("function");

      expect(transport.sent).toHaveLength(1);
      expect(transport.sent[0]).toEqual({
        jsonrpc: "2.0",
        id: 1,
        method: "subscribe",
        params: { channels: ["updates"] },
      });
    });

    it("sends subscribe for multiple channels", async () => {
      transport = createMockTransport();
      client = new RpcClient(transport.transport);

      const promise = client.subscribe(["updates", "notifications"]);
      transport.receive({ jsonrpc: "2.0", id: 1, result: true });

      await promise;

      expect((transport.sent[0] as any).params.channels).toEqual(["updates", "notifications"]);
    });

    it("returned function sends unsubscribe call", async () => {
      transport = createMockTransport();
      client = new RpcClient(transport.transport);

      const promise = client.subscribe("updates");
      transport.receive({ jsonrpc: "2.0", id: 1, result: true });

      const unsubscribe = await promise;
      unsubscribe();
      // Respond to the unsubscribe call to avoid unhandled rejection on destroy
      transport.receive({ jsonrpc: "2.0", id: 2, result: true });

      expect(transport.sent).toHaveLength(2);
      expect(transport.sent[1]).toEqual({
        jsonrpc: "2.0",
        id: 2,
        method: "unsubscribe",
        params: { channels: ["updates"] },
      });
    });
  });

  describe("channel events", () => {
    it("on() receives subscription events", () => {
      transport = createMockTransport();
      client = new RpcClient(transport.transport);

      const received: unknown[] = [];
      client.on("updates", (data) => received.push(data));

      transport.receive({
        jsonrpc: "2.0",
        method: "subscription",
        params: { channel: "updates", data: { value: 42 } },
      });

      expect(received).toEqual([{ value: 42 }]);
    });

    it("on() receives multiple events", () => {
      transport = createMockTransport();
      client = new RpcClient(transport.transport);

      const received: unknown[] = [];
      client.on("updates", (data) => received.push(data));

      transport.receive({
        jsonrpc: "2.0",
        method: "subscription",
        params: { channel: "updates", data: { value: 1 } },
      });
      transport.receive({
        jsonrpc: "2.0",
        method: "subscription",
        params: { channel: "updates", data: { value: 2 } },
      });

      expect(received).toEqual([{ value: 1 }, { value: 2 }]);
    });

    it("off() stops receiving events", () => {
      transport = createMockTransport();
      client = new RpcClient(transport.transport);

      const received: unknown[] = [];
      const handler = (data: { value: number }) => received.push(data);
      client.on("updates", handler);

      transport.receive({
        jsonrpc: "2.0",
        method: "subscription",
        params: { channel: "updates", data: { value: 1 } },
      });

      client.off("updates", handler);

      transport.receive({
        jsonrpc: "2.0",
        method: "subscription",
        params: { channel: "updates", data: { value: 2 } },
      });

      expect(received).toEqual([{ value: 1 }]);
    });

    it("once() receives only the first event", () => {
      transport = createMockTransport();
      client = new RpcClient(transport.transport);

      const received: unknown[] = [];
      client.once("updates", (data) => received.push(data));

      transport.receive({
        jsonrpc: "2.0",
        method: "subscription",
        params: { channel: "updates", data: { value: 1 } },
      });
      transport.receive({
        jsonrpc: "2.0",
        method: "subscription",
        params: { channel: "updates", data: { value: 2 } },
      });

      expect(received).toEqual([{ value: 1 }]);
    });

    it("events for different channels are independent", () => {
      transport = createMockTransport();
      client = new RpcClient(transport.transport);

      const updates: unknown[] = [];
      const notifications: unknown[] = [];
      client.on("updates", (data) => updates.push(data));
      client.on("notifications", (data) => notifications.push(data));

      transport.receive({
        jsonrpc: "2.0",
        method: "subscription",
        params: { channel: "updates", data: { value: 1 } },
      });
      transport.receive({
        jsonrpc: "2.0",
        method: "subscription",
        params: { channel: "notifications", data: { text: "hello" } },
      });

      expect(updates).toEqual([{ value: 1 }]);
      expect(notifications).toEqual([{ text: "hello" }]);
    });
  });

  describe("destroy", () => {
    it("rejects all pending calls with RpcError", async () => {
      transport = createMockTransport();
      client = new RpcClient(transport.transport);

      const p1 = client.call("echo", { message: "1" });
      const p2 = client.call("echo", { message: "2" });

      client.destroy();

      const results = await Promise.allSettled([p1, p2]);
      for (const result of results) {
        expect(result.status).toBe("rejected");
        if (result.status === "rejected") {
          expect(result.reason).toBeInstanceOf(RpcError);
          expect(result.reason.message).toBe("Client destroyed");
        }
      }
    });

    it("removes the transport listener", () => {
      transport = createMockTransport();
      client = new RpcClient(transport.transport);
      expect(transport.hasListener).toBe(true);

      client.destroy();
      expect(transport.hasListener).toBe(false);
    });

    it("is safe to call destroy multiple times", () => {
      transport = createMockTransport();
      client = new RpcClient(transport.transport);

      client.destroy();
      client.destroy(); // Should not throw
    });
  });
});
