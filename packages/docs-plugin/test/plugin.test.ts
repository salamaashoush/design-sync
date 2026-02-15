import { describe, expect, it } from "vitest";
import { docsPlugin } from "../src/plugin";

describe("docsPlugin", () => {
  it("should create a plugin with correct metadata", () => {
    const plugin = docsPlugin();
    expect(plugin.meta.name).toBe("docs-plugin");
  });

  it("should accept configuration options", () => {
    const plugin = docsPlugin({
      outDir: "documentation",
      projectName: "My Design System",
      markdown: true,
      html: true,
      json: true,
      includeDeprecated: false,
      includeGenerated: true,
    });
    expect(plugin.meta.name).toBe("docs-plugin");
  });

  it("should accept markdown options", () => {
    const plugin = docsPlugin({
      markdown: {
        splitByType: true,
        includeToc: true,
        includePreviews: true,
      },
    });
    expect(plugin.meta.name).toBe("docs-plugin");
  });

  it("should accept html options", () => {
    const plugin = docsPlugin({
      html: {
        title: "My Tokens",
        enableSearch: true,
        enableModeSwitch: true,
        enableCopy: true,
        showExamples: true,
        primaryColor: "#3b82f6",
      },
    });
    expect(plugin.meta.name).toBe("docs-plugin");
  });

  it("should support custom logo and CSS", () => {
    const plugin = docsPlugin({
      logoUrl: "https://example.com/logo.png",
      customCss: ".custom { color: red; }",
    });
    expect(plugin.meta.name).toBe("docs-plugin");
  });

  it("should disable features individually", () => {
    const plugin = docsPlugin({
      markdown: false,
      html: {
        enableSearch: false,
        enableModeSwitch: false,
        enableCopy: false,
        showExamples: false,
      },
    });
    expect(plugin.meta.name).toBe("docs-plugin");
  });
});
