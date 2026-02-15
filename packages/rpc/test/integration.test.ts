import { afterEach, describe, expect, it } from "bun:test";
import { RpcClient } from "../src/client";
import { RPC_ERROR_CODES, RpcError, RpcTimeoutError } from "../src/errors";
import { RpcServer } from "../src/server";
import { createLinkedTransports } from "./helpers";

describe("Client-Server Integration", () => {
  let client: RpcClient;
  let server: RpcServer;

  function setup(clientTimeout?: number) {
    const { clientTransport, serverTransport } = createLinkedTransports();
    server = new RpcServer(serverTransport);
    client = new RpcClient(clientTransport, clientTimeout ? { timeout: clientTimeout } : undefined);
  }

  afterEach(() => {
    client?.destroy();
    server?.destroy();
  });

  describe("basic call / response", () => {
    it("client calls server and receives result", async () => {
      setup();
      server.handle("echo", async (params) => params.message);

      const result = await client.call("echo", { message: "hello" });
      expect(result).toBe("hello");
    });

    it("handles computed results", async () => {
      setup();
      server.handle("add", async (params) => params.a + params.b);

      const result = await client.call("add", { a: 10, b: 32 });
      expect(result).toBe(42);
    });

    it("handles void return", async () => {
      setup();
      server.handle("noop", async () => undefined);

      const result = await client.call("noop");
      expect(result).toBeUndefined();
    });

    it("handles sequential calls", async () => {
      setup();
      server.handle("echo", async (params) => params.message);

      const r1 = await client.call("echo", { message: "first" });
      const r2 = await client.call("echo", { message: "second" });
      const r3 = await client.call("echo", { message: "third" });

      expect(r1).toBe("first");
      expect(r2).toBe("second");
      expect(r3).toBe("third");
    });
  });

  describe("error propagation", () => {
    it("server error reaches client as RpcError", async () => {
      setup();
      server.handle("echo", async () => {
        throw new Error("server exploded");
      });

      try {
        await client.call("echo", { message: "hello" });
        expect.unreachable("should have thrown");
      } catch (err) {
        expect(err).toBeInstanceOf(RpcError);
        expect(err).toBeInstanceOf(Error);
        expect((err as RpcError).message).toBe("server exploded");
        expect((err as RpcError).code).toBe(RPC_ERROR_CODES.SERVER_ERROR);
      }
    });

    it("METHOD_NOT_FOUND reaches client as RpcError", async () => {
      setup();
      // No handler registered for "echo"

      try {
        await client.call("echo", { message: "hello" });
        expect.unreachable("should have thrown");
      } catch (err) {
        expect(err).toBeInstanceOf(RpcError);
        expect((err as RpcError).code).toBe(RPC_ERROR_CODES.METHOD_NOT_FOUND);
        expect((err as RpcError).message).toContain("echo");
      }
    });

    it("error is instanceof Error (not plain object)", async () => {
      setup();
      server.handle("echo", async () => {
        throw new Error("fail");
      });

      try {
        await client.call("echo", { message: "hello" });
        expect.unreachable("should have thrown");
      } catch (err) {
        // This was a bug before — errors were plain objects, not Error instances
        expect(err).toBeInstanceOf(Error);
        expect(err).toBeInstanceOf(RpcError);
      }
    });
  });

  describe("concurrent calls", () => {
    it("handles multiple calls in parallel", async () => {
      setup();
      server.handle("echo", async (params) => params.message);
      server.handle("add", async (params) => params.a + params.b);

      const [r1, r2, r3] = await Promise.all([
        client.call("echo", { message: "one" }),
        client.call("add", { a: 2, b: 3 }),
        client.call("echo", { message: "three" }),
      ]);

      expect(r1).toBe("one");
      expect(r2).toBe(5);
      expect(r3).toBe("three");
    });

    it("handles mixed success and failure in parallel", async () => {
      setup();
      server.handle("echo", async (params) => params.message);
      // "add" is not registered

      const results = await Promise.allSettled([
        client.call("echo", { message: "ok" }),
        client.call("add", { a: 1, b: 2 }),
      ]);

      expect(results[0].status).toBe("fulfilled");
      expect((results[0] as PromiseFulfilledResult<string>).value).toBe("ok");
      expect(results[1].status).toBe("rejected");
      expect((results[1] as PromiseRejectedResult).reason).toBeInstanceOf(RpcError);
    });
  });

  describe("subscribe / unsubscribe flow", () => {
    it("subscribe resolves without deadlock", async () => {
      setup();

      const unsubscribe = await client.subscribe("updates");
      expect(typeof unsubscribe).toBe("function");
    });

    it("server emits reach subscribed client", async () => {
      setup();

      const received: unknown[] = [];
      client.on("updates", (data) => received.push(data));

      await client.subscribe("updates");

      server.emit("updates", { value: 1 });
      await new Promise((r) => setTimeout(r, 20));

      expect(received).toEqual([{ value: 1 }]);
    });

    it("multiple emits reach client", async () => {
      setup();

      const received: unknown[] = [];
      client.on("updates", (data) => received.push(data));

      await client.subscribe("updates");

      server.emit("updates", { value: 1 });
      server.emit("updates", { value: 2 });
      server.emit("updates", { value: 3 });
      await new Promise((r) => setTimeout(r, 20));

      expect(received).toEqual([{ value: 1 }, { value: 2 }, { value: 3 }]);
    });

    it("unsubscribe stops events from reaching client", async () => {
      setup();

      const received: unknown[] = [];
      client.on("updates", (data) => received.push(data));

      const unsubscribe = await client.subscribe("updates");

      server.emit("updates", { value: 1 });
      await new Promise((r) => setTimeout(r, 20));

      unsubscribe();
      await new Promise((r) => setTimeout(r, 20));

      server.emit("updates", { value: 2 });
      await new Promise((r) => setTimeout(r, 20));

      expect(received).toEqual([{ value: 1 }]);
    });

    it("subscribe to multiple channels", async () => {
      setup();

      const updates: unknown[] = [];
      const notifications: unknown[] = [];
      client.on("updates", (data) => updates.push(data));
      client.on("notifications", (data) => notifications.push(data));

      await client.subscribe(["updates", "notifications"]);

      server.emit("updates", { value: 1 });
      server.emit("notifications", { text: "hello" });
      await new Promise((r) => setTimeout(r, 20));

      expect(updates).toEqual([{ value: 1 }]);
      expect(notifications).toEqual([{ text: "hello" }]);
    });
  });

  describe("timeout", () => {
    it("client times out when no one listens on server side", async () => {
      // Create transports but don't create a server — messages go nowhere
      const { clientTransport } = createLinkedTransports();
      client = new RpcClient(clientTransport, { timeout: 50 });

      try {
        await client.call("echo", { message: "hello" });
        expect.unreachable("should have thrown");
      } catch (err) {
        expect(err).toBeInstanceOf(RpcTimeoutError);
        expect((err as RpcTimeoutError).method).toBe("echo");
      }
    });

    it("client times out when server handler never resolves", async () => {
      setup(100);
      server.handle("echo", () => new Promise(() => {})); // never resolves

      try {
        await client.call("echo", { message: "hello" });
        expect.unreachable("should have thrown");
      } catch (err) {
        expect(err).toBeInstanceOf(RpcTimeoutError);
      }
    });
  });

  describe("client destroy while calls pending", () => {
    it("rejects all pending calls", async () => {
      setup();
      server.handle("echo", () => new Promise(() => {})); // never resolves

      const promise = client.call("echo", { message: "hello" });

      // Give time for request to reach server
      await new Promise((r) => setTimeout(r, 10));

      client.destroy();

      try {
        await promise;
        expect.unreachable("should have thrown");
      } catch (err) {
        expect(err).toBeInstanceOf(RpcError);
        expect((err as RpcError).message).toBe("Client destroyed");
      }
    });
  });

  describe("handler replacement", () => {
    it("server uses latest handler after replacement", async () => {
      setup();

      server.handle("echo", async () => "old");
      const r1 = await client.call("echo", { message: "test" });
      expect(r1).toBe("old");

      server.handle("echo", async () => "new");
      const r2 = await client.call("echo", { message: "test" });
      expect(r2).toBe("new");
    });

    it("removeHandler makes method return METHOD_NOT_FOUND", async () => {
      setup();

      server.handle("echo", async (params) => params.message);
      const r1 = await client.call("echo", { message: "works" });
      expect(r1).toBe("works");

      server.removeHandler("echo");

      try {
        await client.call("echo", { message: "fails" });
        expect.unreachable("should have thrown");
      } catch (err) {
        expect(err).toBeInstanceOf(RpcError);
        expect((err as RpcError).code).toBe(RPC_ERROR_CODES.METHOD_NOT_FOUND);
      }
    });
  });
});
