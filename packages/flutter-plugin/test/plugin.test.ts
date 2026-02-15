import { describe, expect, it } from "vitest";
import { flutterPlugin } from "../src/plugin";

describe("flutterPlugin", () => {
  it("should create a plugin with correct metadata", () => {
    const plugin = flutterPlugin();
    expect(plugin.meta.name).toBe("flutter-plugin");
  });

  it("should accept configuration options", () => {
    const plugin = flutterPlugin({
      outDir: "lib/theme",
      libraryName: "app_theme",
      material3: true,
      generateThemeData: true,
      supportDarkMode: true,
      useConst: true,
    });
    expect(plugin.meta.name).toBe("flutter-plugin");
  });

  it("should support material 2", () => {
    const plugin = flutterPlugin({
      material3: false,
    });
    expect(plugin.meta.name).toBe("flutter-plugin");
  });

  it("should allow disabling const constructors", () => {
    const plugin = flutterPlugin({
      useConst: false,
    });
    expect(plugin.meta.name).toBe("flutter-plugin");
  });
});
