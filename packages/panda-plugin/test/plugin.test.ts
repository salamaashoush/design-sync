import { describe, expect, it } from "vitest";
import { pandaPlugin } from "../src/plugin";

describe("pandaPlugin", () => {
  it("should create a plugin with correct metadata", () => {
    const plugin = pandaPlugin();
    expect(plugin.meta.name).toBe("panda-plugin");
  });

  it("should accept configuration options", () => {
    const plugin = pandaPlugin({
      outDir: "panda",
      format: "preset",
      useSemanticTokens: true,
      generateTypes: true,
      prefix: "ds",
    });
    expect(plugin.meta.name).toBe("panda-plugin");
  });

  it("should accept custom conditions", () => {
    const plugin = pandaPlugin({
      conditions: {
        breakpoints: {
          sm: "@media (min-width: 640px)",
          md: "@media (min-width: 768px)",
        },
        colorMode: {
          dark: '[data-theme="dark"]',
          light: '[data-theme="light"]',
        },
      },
    });
    expect(plugin.meta.name).toBe("panda-plugin");
  });
});
