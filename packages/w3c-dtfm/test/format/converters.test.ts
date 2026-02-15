/**
 * Format Converters Tests
 *
 * Tests for converting between legacy and W3C formats.
 */
import { describe, expect, it } from "bun:test";
import {
  convertValueToW3C,
  convertValueToLegacy,
  legacyColorToW3C,
  w3cColorToLegacy,
  legacyDimensionToW3C,
  w3cDimensionToLegacy,
  legacyDurationToW3C,
  w3cDurationToLegacy,
  legacyAliasToW3CRef,
  w3cRefToLegacyAlias,
} from "../../src/format/converters";
import type { W3CColorValue, W3CDimensionValue, W3CDurationValue } from "../../src/types/w3c";

describe("Format Converters", () => {
  describe("legacyColorToW3C", () => {
    it("should convert hex color to W3C format", () => {
      const result = legacyColorToW3C("#ff0000");

      expect(result.colorSpace).toBe("srgb");
      expect(result.components).toHaveLength(3);
      expect(result.components[0]).toBeCloseTo(1, 2);
      expect(result.components[1]).toBeCloseTo(0, 2);
      expect(result.components[2]).toBeCloseTo(0, 2);
    });

    it("should convert 3-digit hex", () => {
      const result = legacyColorToW3C("#f00");

      expect(result.colorSpace).toBe("srgb");
      expect(result.components[0]).toBeCloseTo(1, 2);
    });

    it("should convert rgb() format", () => {
      const result = legacyColorToW3C("rgb(255, 128, 0)");

      expect(result.colorSpace).toBe("srgb");
      expect(result.components[0]).toBeCloseTo(1, 2);
      expect(result.components[1]).toBeCloseTo(0.5, 1);
    });

    it("should convert rgba() format with alpha", () => {
      const result = legacyColorToW3C("rgba(255, 0, 0, 0.5)");

      expect(result.colorSpace).toBe("srgb");
      expect(result.alpha).toBeCloseTo(0.5, 2);
    });

    it("should convert hsl() format", () => {
      const result = legacyColorToW3C("hsl(0, 100%, 50%)");

      expect(result).toBeDefined();
    });

    it("should convert named colors", () => {
      const result = legacyColorToW3C("red");

      expect(result.colorSpace).toBe("srgb");
      expect(result.components[0]).toBeCloseTo(1, 2);
    });

    it("should include hex property", () => {
      const result = legacyColorToW3C("#ff0000");

      expect(result.hex).toBeDefined();
    });
  });

  describe("w3cColorToLegacy", () => {
    it("should convert W3C color to hex", () => {
      const w3cColor: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
      };

      const result = w3cColorToLegacy(w3cColor);

      expect(result).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it("should use hex property if available", () => {
      const w3cColor: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
        hex: "#ff0000",
      };

      const result = w3cColorToLegacy(w3cColor);

      expect(result).toBe("#ff0000");
    });

    it("should handle colors with alpha", () => {
      const w3cColor: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
        alpha: 0.5,
      };

      const result = w3cColorToLegacy(w3cColor);

      // Should be rgba or 8-digit hex
      expect(result).toBeTruthy();
    });
  });

  describe("legacyDimensionToW3C", () => {
    it("should convert px dimension", () => {
      const result = legacyDimensionToW3C("16px");

      expect(result).toEqual({ value: 16, unit: "px" });
    });

    it("should convert rem dimension", () => {
      const result = legacyDimensionToW3C("1.5rem");

      expect(result).toEqual({ value: 1.5, unit: "rem" });
    });

    it("should convert negative dimension", () => {
      const result = legacyDimensionToW3C("-10px");

      expect(result).toEqual({ value: -10, unit: "px" });
    });

    it("should convert zero", () => {
      const result = legacyDimensionToW3C("0px");

      expect(result).toEqual({ value: 0, unit: "px" });
    });

    it("should convert decimal values", () => {
      const result = legacyDimensionToW3C("1.25rem");

      expect(result).toEqual({ value: 1.25, unit: "rem" });
    });
  });

  describe("w3cDimensionToLegacy", () => {
    it("should convert px dimension to string", () => {
      const dim: W3CDimensionValue = { value: 16, unit: "px" };

      expect(w3cDimensionToLegacy(dim)).toBe("16px");
    });

    it("should convert rem dimension to string", () => {
      const dim: W3CDimensionValue = { value: 1.5, unit: "rem" };

      expect(w3cDimensionToLegacy(dim)).toBe("1.5rem");
    });

    it("should handle negative values", () => {
      const dim: W3CDimensionValue = { value: -10, unit: "px" };

      expect(w3cDimensionToLegacy(dim)).toBe("-10px");
    });
  });

  describe("legacyDurationToW3C", () => {
    it("should convert ms duration", () => {
      const result = legacyDurationToW3C("500ms");

      expect(result).toEqual({ value: 500, unit: "ms" });
    });

    it("should convert s duration", () => {
      const result = legacyDurationToW3C("0.5s");

      expect(result).toEqual({ value: 0.5, unit: "s" });
    });

    it("should convert zero", () => {
      const result = legacyDurationToW3C("0ms");

      expect(result).toEqual({ value: 0, unit: "ms" });
    });
  });

  describe("w3cDurationToLegacy", () => {
    it("should convert ms duration to string", () => {
      const dur: W3CDurationValue = { value: 500, unit: "ms" };

      expect(w3cDurationToLegacy(dur)).toBe("500ms");
    });

    it("should convert s duration to string", () => {
      const dur: W3CDurationValue = { value: 0.5, unit: "s" };

      expect(w3cDurationToLegacy(dur)).toBe("0.5s");
    });
  });

  describe("legacyAliasToW3CRef", () => {
    it("should convert curly brace alias to $ref", () => {
      const result = legacyAliasToW3CRef("{colors.primary}");

      expect(result).toEqual({ $ref: "#/colors/primary" });
    });

    it("should handle nested paths", () => {
      const result = legacyAliasToW3CRef("{brand.colors.primary.500}");

      expect(result).toEqual({ $ref: "#/brand/colors/primary/500" });
    });
  });

  describe("w3cRefToLegacyAlias", () => {
    it("should convert $ref to curly brace alias", () => {
      const result = w3cRefToLegacyAlias({ $ref: "#/colors/primary" });

      expect(result).toBe("{colors.primary}");
    });

    it("should handle nested paths", () => {
      const result = w3cRefToLegacyAlias({ $ref: "#/brand/colors/primary/500" });

      expect(result).toBe("{brand.colors.primary.500}");
    });
  });

  describe("convertValueToW3C", () => {
    it("should convert legacy color", () => {
      const result = convertValueToW3C("#ff0000");

      expect(result).toHaveProperty("colorSpace");
      expect(result).toHaveProperty("components");
    });

    it("should convert legacy dimension", () => {
      const result = convertValueToW3C("16px");

      expect(result).toEqual({ value: 16, unit: "px" });
    });

    it("should convert legacy duration", () => {
      const result = convertValueToW3C("500ms");

      expect(result).toEqual({ value: 500, unit: "ms" });
    });

    // Note: convertValueToW3C keeps aliases as-is, doesn't convert to $ref
    it("should keep legacy alias as-is", () => {
      const result = convertValueToW3C("{colors.primary}");

      expect(result).toBe("{colors.primary}");
    });

    it("should return W3C values unchanged", () => {
      const w3cColor: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
      };

      const result = convertValueToW3C(w3cColor);

      expect(result).toEqual(w3cColor);
    });

    it("should return numbers unchanged", () => {
      expect(convertValueToW3C(42)).toBe(42);
    });
  });

  describe("convertValueToLegacy", () => {
    it("should convert W3C color", () => {
      const w3cColor: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
      };

      const result = convertValueToLegacy(w3cColor);

      expect(typeof result).toBe("string");
    });

    it("should convert W3C dimension", () => {
      const dim: W3CDimensionValue = { value: 16, unit: "px" };

      expect(convertValueToLegacy(dim)).toBe("16px");
    });

    it("should convert W3C duration", () => {
      const dur: W3CDurationValue = { value: 500, unit: "ms" };

      expect(convertValueToLegacy(dur)).toBe("500ms");
    });

    it("should convert $ref to alias", () => {
      const result = convertValueToLegacy({ $ref: "#/colors/primary" });

      expect(result).toBe("{colors.primary}");
    });

    it("should return legacy values unchanged", () => {
      expect(convertValueToLegacy("#ff0000")).toBe("#ff0000");
      expect(convertValueToLegacy("16px")).toBe("16px");
    });

    it("should return numbers unchanged", () => {
      expect(convertValueToLegacy(42)).toBe(42);
    });
  });
});
