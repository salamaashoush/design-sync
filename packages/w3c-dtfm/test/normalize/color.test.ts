/**
 * Color Normalizer Tests
 *
 * Tests for color value normalization.
 */
import { describe, expect, it } from "bun:test";
import {
  normalizeColorValue,
  colorToW3C,
  colorToLegacy,
  colorToCSS,
} from "../../src/normalize/color";
import type { W3CColorValue } from "../../src/types/w3c";

describe("Color Normalizer", () => {
  describe("normalizeColorValue", () => {
    it("should pass through W3C color unchanged", () => {
      const w3c: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
      };
      const result = normalizeColorValue(w3c);
      expect(result).toEqual(w3c);
    });

    it("should pass through W3C color with alpha", () => {
      const w3c: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
        alpha: 0.5,
      };
      const result = normalizeColorValue(w3c);
      expect(result).toEqual(w3c);
    });

    it("should apply modifiers to W3C color", () => {
      const w3c: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
      };
      const result = normalizeColorValue(w3c, { type: "alpha", value: 0.5 });
      expect(result).toBeDefined();
      expect((result as W3CColorValue).colorSpace).toBe("srgb");
    });

    it("should normalize hex color string", () => {
      const result = normalizeColorValue("#ff0000");
      expect(result).toBe("#ff0000");
    });

    it("should normalize 3-digit hex color", () => {
      const result = normalizeColorValue("#f00");
      expect(typeof result).toBe("string");
    });

    it("should apply modifiers to hex color", () => {
      const result = normalizeColorValue("#ff0000", { type: "alpha", value: 0.5 });
      expect(typeof result).toBe("string");
    });

    it("should pass through token alias unchanged", () => {
      const result = normalizeColorValue("{colors.primary}");
      expect(result).toBe("{colors.primary}");
    });

    it("should throw for invalid value", () => {
      expect(() => normalizeColorValue(123)).toThrow("not a valid DTFM color value");
    });

    it("should throw for null", () => {
      expect(() => normalizeColorValue(null)).toThrow();
    });
  });

  describe("colorToW3C", () => {
    it("should pass through W3C color unchanged", () => {
      const w3c: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
      };
      expect(colorToW3C(w3c)).toEqual(w3c);
    });

    it("should convert hex string to W3C", () => {
      const result = colorToW3C("#ff0000");
      expect(result.colorSpace).toBe("srgb");
      expect(result.components).toBeDefined();
      expect(result.components[0]).toBeCloseTo(1, 1);
      expect(result.components[1]).toBeCloseTo(0, 1);
      expect(result.components[2]).toBeCloseTo(0, 1);
    });

    it("should convert rgb string to W3C", () => {
      const result = colorToW3C("rgb(255, 0, 0)");
      expect(result.colorSpace).toBe("srgb");
    });

    it("should throw for invalid string", () => {
      expect(() => colorToW3C("not-a-color")).toThrow();
    });

    it("should throw for non-string/non-object", () => {
      expect(() => colorToW3C(123 as any)).toThrow("Cannot convert");
    });
  });

  describe("colorToLegacy", () => {
    it("should pass through hex string unchanged", () => {
      const result = colorToLegacy("#ff0000");
      expect(result).toBe("#ff0000");
    });

    it("should convert W3C to CSS color string", () => {
      const w3c: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
      };
      const result = colorToLegacy(w3c);
      // Without hex property, returns CSS color() syntax
      expect(typeof result).toBe("string");
    });

    it("should convert W3C with hex property to hex string", () => {
      const w3c: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
        hex: "#ff0000",
      };
      const result = colorToLegacy(w3c);
      expect(result).toBe("#ff0000");
    });

    it("should convert rgb string to hex", () => {
      const result = colorToLegacy("rgb(255, 0, 0)");
      expect(typeof result).toBe("string");
    });

    it("should throw for invalid type", () => {
      expect(() => colorToLegacy(123 as any)).toThrow("Cannot convert");
    });
  });

  describe("colorToCSS", () => {
    it("should pass through string unchanged", () => {
      expect(colorToCSS("#ff0000")).toBe("#ff0000");
    });

    it("should convert W3C to CSS", () => {
      const w3c: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
      };
      const result = colorToCSS(w3c);
      expect(typeof result).toBe("string");
    });

    it("should throw for invalid type", () => {
      expect(() => colorToCSS(123 as any)).toThrow("Cannot convert");
    });
  });
});
