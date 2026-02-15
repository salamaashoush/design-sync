import { describe, expect, it } from "vitest";
import { emotionPlugin } from "../src/plugin";

describe("emotionPlugin", () => {
  it("should create a plugin with correct metadata", () => {
    const plugin = emotionPlugin();
    expect(plugin.meta.name).toBe("emotion-plugin");
  });

  it("should accept configuration options", () => {
    const plugin = emotionPlugin({
      outDir: "emotion",
      useTs: true,
      useCssVars: true,
      prefix: "ds",
      generateGlobalStyles: true,
      generateProvider: true,
    });
    expect(plugin.meta.name).toBe("emotion-plugin");
  });

  it("should accept breakpoints configuration", () => {
    const plugin = emotionPlugin({
      breakpoints: {
        sm: "(min-width: 640px)",
        md: "(min-width: 768px)",
        lg: "(min-width: 1024px)",
      },
    });
    expect(plugin.meta.name).toBe("emotion-plugin");
  });
});
