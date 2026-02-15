import { describe, expect, it } from "vitest";
import { tamaguiPlugin } from "../src/plugin";

describe("tamaguiPlugin", () => {
  it("should create a plugin with correct metadata", () => {
    const plugin = tamaguiPlugin();
    expect(plugin.meta.name).toBe("tamagui-plugin");
  });

  it("should accept configuration options", () => {
    const plugin = tamaguiPlugin({
      outDir: "tamagui",
      useTs: true,
      themePrefix: "app",
      generateShorthands: true,
      includeWeb: true,
      includeNative: true,
    });
    expect(plugin.meta.name).toBe("tamagui-plugin");
  });

  it("should accept media configuration", () => {
    const plugin = tamaguiPlugin({
      media: {
        xs: { maxWidth: 660 },
        sm: { maxWidth: 800 },
        md: { maxWidth: 1020 },
        lg: { maxWidth: 1280 },
        xl: { maxWidth: 1420 },
        xxl: { maxWidth: 1600 },
        gtXs: { minWidth: 660 + 1 },
        gtSm: { minWidth: 800 + 1 },
        gtMd: { minWidth: 1020 + 1 },
        gtLg: { minWidth: 1280 + 1 },
        short: { maxWidth: 820 },
        tall: { minWidth: 820 },
      },
    });
    expect(plugin.meta.name).toBe("tamagui-plugin");
  });
});
