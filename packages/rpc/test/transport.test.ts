import { describe, expect, it, mock } from "bun:test";
import { createFigmaMainTransport } from "../src/transport";

function createMockFigmaUI() {
  const handlers = new Map<string, Set<(message: unknown) => void>>();

  return {
    postMessage: mock((_message: unknown, _options?: { origin: string }) => {}),
    on: mock((event: string, handler: (message: unknown) => void) => {
      if (!handlers.has(event)) handlers.set(event, new Set());
      handlers.get(event)!.add(handler);
    }),
    off: mock((event: string, handler: (message: unknown) => void) => {
      handlers.get(event)?.delete(handler);
    }),
    _emit(event: string, message: unknown) {
      handlers.get(event)?.forEach((h) => h(message));
    },
  };
}

describe("createFigmaMainTransport", () => {
  describe("send", () => {
    it("calls ui.postMessage with origin *", () => {
      const ui = createMockFigmaUI();
      const transport = createFigmaMainTransport(ui);

      transport.send({ test: true });

      expect(ui.postMessage).toHaveBeenCalledTimes(1);
      expect(ui.postMessage).toHaveBeenCalledWith({ test: true }, { origin: "*" });
    });

    it("sends multiple messages", () => {
      const ui = createMockFigmaUI();
      const transport = createFigmaMainTransport(ui);

      transport.send({ a: 1 });
      transport.send({ b: 2 });

      expect(ui.postMessage).toHaveBeenCalledTimes(2);
    });
  });

  describe("listen", () => {
    it("registers a handler via ui.on('message')", () => {
      const ui = createMockFigmaUI();
      const transport = createFigmaMainTransport(ui);

      transport.listen(() => {});

      expect(ui.on).toHaveBeenCalledTimes(1);
      expect(ui.on).toHaveBeenCalledWith("message", expect.any(Function));
    });

    it("delivers incoming messages to the handler", () => {
      const ui = createMockFigmaUI();
      const transport = createFigmaMainTransport(ui);
      const handler = mock(() => {});

      transport.listen(handler);
      ui._emit("message", { jsonrpc: "2.0", id: 1, result: "ok" });

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith({ jsonrpc: "2.0", id: 1, result: "ok" });
    });

    it("returns an unlisten function that calls ui.off", () => {
      const ui = createMockFigmaUI();
      const transport = createFigmaMainTransport(ui);

      const unlisten = transport.listen(() => {});
      unlisten();

      expect(ui.off).toHaveBeenCalledTimes(1);
      expect(ui.off).toHaveBeenCalledWith("message", expect.any(Function));
    });

    it("stops delivering messages after unlisten", () => {
      const ui = createMockFigmaUI();
      const transport = createFigmaMainTransport(ui);
      const handler = mock(() => {});

      const unlisten = transport.listen(handler);
      unlisten();

      ui._emit("message", { jsonrpc: "2.0", id: 1, result: "ok" });

      expect(handler).not.toHaveBeenCalled();
    });
  });
});
