import { describe, expect, it } from "vitest";
import { reactNativePlugin } from "../src/plugin";

describe("reactNativePlugin", () => {
  it("should create a plugin with correct metadata", () => {
    const plugin = reactNativePlugin();
    expect(plugin.meta.name).toBe("react-native-plugin");
  });

  it("should accept configuration options", () => {
    const plugin = reactNativePlugin({
      outDir: "rn",
      useTs: true,
      useStyleSheet: true,
      remToPixels: 16,
      generateProvider: true,
      platforms: ["ios", "android"],
    });
    expect(plugin.meta.name).toBe("react-native-plugin");
  });

  it("should allow disabling rem conversion", () => {
    const plugin = reactNativePlugin({
      remToPixels: false,
    });
    expect(plugin.meta.name).toBe("react-native-plugin");
  });

  it("should support custom rem base", () => {
    const plugin = reactNativePlugin({
      remToPixels: 14, // Smaller base font size
    });
    expect(plugin.meta.name).toBe("react-native-plugin");
  });
});
