import { describe, expect, it } from "vitest";
import { swiftUIPlugin } from "../src/plugin";

describe("swiftUIPlugin", () => {
  it("should create a plugin with correct metadata", () => {
    const plugin = swiftUIPlugin();
    expect(plugin.meta.name).toBe("swiftui-plugin");
  });

  it("should accept configuration options", () => {
    const plugin = swiftUIPlugin({
      outDir: "Sources/DesignTokens",
      packageName: "DesignTokens",
      accessLevel: "public",
      generateAssetCatalog: true,
      colorType: "SwiftUI",
      supportDarkMode: true,
    });
    expect(plugin.meta.name).toBe("swiftui-plugin");
  });

  it("should support UIKit colors", () => {
    const plugin = swiftUIPlugin({
      colorType: "UIKit",
    });
    expect(plugin.meta.name).toBe("swiftui-plugin");
  });

  it("should support internal access level", () => {
    const plugin = swiftUIPlugin({
      accessLevel: "internal",
    });
    expect(plugin.meta.name).toBe("swiftui-plugin");
  });

  it("should allow disabling dark mode", () => {
    const plugin = swiftUIPlugin({
      supportDarkMode: false,
    });
    expect(plugin.meta.name).toBe("swiftui-plugin");
  });
});
