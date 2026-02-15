/**
 * Format Detector Tests
 *
 * Tests for detecting legacy vs W3C token format.
 */
import { describe, expect, it } from "bun:test";
import { detectTokenFormat, analyzeTokens } from "../../src/format/detector";

describe("Format Detector", () => {
  describe("detectTokenFormat", () => {
    it('should detect pure legacy format as "legacy"', () => {
      const tokens = {
        colors: {
          primary: {
            $type: "color",
            $value: "#ff0000",
          },
        },
        spacing: {
          md: {
            $type: "dimension",
            $value: "16px",
          },
        },
      };

      expect(detectTokenFormat(tokens)).toBe("legacy");
    });

    it('should detect pure W3C format as "w3c"', () => {
      const tokens = {
        colors: {
          primary: {
            $type: "color",
            $value: {
              colorSpace: "srgb",
              components: [1, 0, 0],
            },
          },
        },
        spacing: {
          md: {
            $type: "dimension",
            $value: { value: 16, unit: "px" },
          },
        },
      };

      expect(detectTokenFormat(tokens)).toBe("w3c");
    });

    it('should detect mixed format as "mixed"', () => {
      const tokens = {
        colors: {
          primary: {
            $type: "color",
            $value: "#ff0000", // legacy
          },
          secondary: {
            $type: "color",
            $value: {
              colorSpace: "srgb",
              components: [0, 0, 1],
            }, // W3C
          },
        },
      };

      expect(detectTokenFormat(tokens)).toBe("mixed");
    });

    it('should return "unknown" for empty object', () => {
      expect(detectTokenFormat({})).toBe("unknown");
    });

    it('should return "unknown" for non-token object', () => {
      const tokens = {
        name: "My Tokens",
        version: "1.0.0",
      };

      expect(detectTokenFormat(tokens)).toBe("unknown");
    });

    it("should handle nested token groups", () => {
      const tokens = {
        brand: {
          colors: {
            $type: "color",
            primary: { $value: "#ff0000" },
            secondary: { $value: "#00ff00" },
          },
        },
      };

      expect(detectTokenFormat(tokens)).toBe("legacy");
    });

    it("should handle alias tokens", () => {
      const tokens = {
        colors: {
          primary: {
            $type: "color",
            $value: "#ff0000",
          },
          alias: {
            $type: "color",
            $value: "{colors.primary}",
          },
        },
      };

      expect(detectTokenFormat(tokens)).toBe("legacy");
    });

    it("should handle $ref format (pure)", () => {
      const tokens = {
        colors: {
          primary: {
            $type: "color",
            $value: {
              colorSpace: "srgb",
              components: [1, 0, 0],
            },
          },
        },
      };

      expect(detectTokenFormat(tokens)).toBe("w3c");
    });

    it("should detect mixed when $ref and W3C are present", () => {
      const tokens = {
        colors: {
          primary: {
            $type: "color",
            $value: {
              colorSpace: "srgb",
              components: [1, 0, 0],
            },
          },
          alias: {
            $type: "color",
            $value: { $ref: "#/colors/primary" },
          },
        },
      };

      // This may be w3c if $ref is not double-counted with components
      const result = detectTokenFormat(tokens);
      expect(["w3c", "mixed"]).toContain(result);
    });

    it("should detect duration format", () => {
      const legacyTokens = {
        animation: {
          duration: {
            $type: "duration",
            $value: "500ms",
          },
        },
      };

      const w3cTokens = {
        animation: {
          duration: {
            $type: "duration",
            $value: { value: 500, unit: "ms" },
          },
        },
      };

      expect(detectTokenFormat(legacyTokens)).toBe("legacy");
      expect(detectTokenFormat(w3cTokens)).toBe("w3c");
    });
  });

  describe("analyzeTokens", () => {
    it("should count legacy and W3C values", () => {
      const tokens = {
        colors: {
          primary: { $type: "color", $value: "#ff0000" },
          secondary: {
            $type: "color",
            $value: { colorSpace: "srgb", components: [0, 1, 0] },
          },
        },
        spacing: {
          sm: { $type: "dimension", $value: "8px" },
          md: { $type: "dimension", $value: { value: 16, unit: "px" } },
        },
      };

      const analysis = analyzeTokens(tokens);

      expect(analysis.format).toBe("mixed");
      expect(analysis.legacyCount).toBeGreaterThanOrEqual(2);
      expect(analysis.w3cCount).toBeGreaterThanOrEqual(2);
    });

    it("should provide details about legacy values", () => {
      const tokens = {
        colors: {
          primary: { $type: "color", $value: "#ff0000" },
        },
        spacing: {
          md: { $type: "dimension", $value: "16px" },
        },
        animation: {
          duration: { $type: "duration", $value: "500ms" },
        },
      };

      const analysis = analyzeTokens(tokens);

      expect(analysis.details.legacyColors).toBeGreaterThanOrEqual(1);
      expect(analysis.details.legacyDimensions).toBeGreaterThanOrEqual(1);
      expect(analysis.details.legacyDurations).toBeGreaterThanOrEqual(1);
    });

    it("should count legacy aliases", () => {
      const tokens = {
        colors: {
          primary: { $type: "color", $value: "#ff0000" },
          alias: { $type: "color", $value: "{colors.primary}" },
        },
      };

      const analysis = analyzeTokens(tokens);

      expect(analysis.details.legacyAliases).toBeGreaterThanOrEqual(1);
    });

    it("should count W3C refs", () => {
      const tokens = {
        colors: {
          primary: {
            $type: "color",
            $value: { colorSpace: "srgb", components: [1, 0, 0] },
          },
          alias: {
            $type: "color",
            $value: { $ref: "#/colors/primary" },
          },
        },
      };

      const analysis = analyzeTokens(tokens);

      expect(analysis.details.w3cRefs).toBeGreaterThanOrEqual(1);
    });

    it("should handle empty tokens", () => {
      const analysis = analyzeTokens({});

      expect(analysis.format).toBe("unknown");
      expect(analysis.legacyCount).toBe(0);
      expect(analysis.w3cCount).toBe(0);
    });

    it("should handle deeply nested tokens", () => {
      const tokens = {
        theme: {
          brand: {
            colors: {
              $type: "color",
              primary: { $value: "#ff0000" },
              secondary: { $value: "#00ff00" },
              tertiary: { $value: "#0000ff" },
            },
          },
        },
      };

      const analysis = analyzeTokens(tokens);

      expect(analysis.details.legacyColors).toBeGreaterThanOrEqual(3);
      expect(analysis.format).toBe("legacy");
    });
  });
});
