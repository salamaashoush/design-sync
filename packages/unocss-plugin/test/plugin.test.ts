import { describe, expect, it } from "vitest";
import { unoCSSPlugin } from "../src/plugin";

describe("unoCSSPlugin", () => {
  it("should create a plugin with correct metadata", () => {
    const plugin = unoCSSPlugin();
    expect(plugin.meta.name).toBe("unocss-plugin");
  });

  it("should accept configuration options", () => {
    const plugin = unoCSSPlugin({
      outDir: "unocss",
      format: "preset",
      useCssVars: true,
      prefix: "ds",
      generateShortcuts: true,
      generateTypes: true,
    });
    expect(plugin.meta.name).toBe("unocss-plugin");
  });

  it("should accept custom breakpoints", () => {
    const plugin = unoCSSPlugin({
      breakpoints: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    });
    expect(plugin.meta.name).toBe("unocss-plugin");
  });
});
