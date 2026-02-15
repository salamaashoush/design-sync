import { describe, expect, it } from "vitest";
import { composePlugin } from "../src/plugin";

describe("composePlugin", () => {
  it("should create a plugin with correct metadata", () => {
    const plugin = composePlugin();
    expect(plugin.meta.name).toBe("compose-plugin");
  });

  it("should accept configuration options", () => {
    const plugin = composePlugin({
      outDir: "app/src/main/java/com/example/theme",
      packageName: "com.example.app.theme",
      material3: true,
      generateTheme: true,
      supportDarkMode: true,
    });
    expect(plugin.meta.name).toBe("compose-plugin");
  });

  it("should support material 2", () => {
    const plugin = composePlugin({
      material3: false,
    });
    expect(plugin.meta.name).toBe("compose-plugin");
  });

  it("should allow disabling dark mode", () => {
    const plugin = composePlugin({
      supportDarkMode: false,
    });
    expect(plugin.meta.name).toBe("compose-plugin");
  });
});
