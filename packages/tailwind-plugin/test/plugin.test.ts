import { describe, expect, it } from "vitest";
import { tailwindPlugin } from "../src/plugin";

describe("tailwindPlugin", () => {
  it("should create a plugin with correct metadata", () => {
    const plugin = tailwindPlugin();
    expect(plugin.meta.name).toBe("tailwind-plugin");
  });

  it("should accept v4 configuration", () => {
    const plugin = tailwindPlugin({
      version: 4,
      outDir: "tailwind",
      cssFileName: "theme.css",
      prefix: "ds",
    });
    expect(plugin.meta.name).toBe("tailwind-plugin");
  });

  it("should accept v3 configuration", () => {
    const plugin = tailwindPlugin({
      version: 3,
      configFileName: "tailwind.config",
      useTs: true,
      extend: true,
      darkMode: "class",
      content: ["./src/**/*.tsx"],
    });
    expect(plugin.meta.name).toBe("tailwind-plugin");
  });

  it("should support different color formats", () => {
    const plugin = tailwindPlugin({
      version: 3,
      colorFormat: "oklch",
    });
    expect(plugin.meta.name).toBe("tailwind-plugin");
  });
});
