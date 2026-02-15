/**
 * Dimension Normalizer Tests
 *
 * Tests for dimension value normalization.
 */
import { describe, expect, it } from "bun:test";
import {
  normalizeDimensionValue,
  destructDimensionValue,
  dimensionToW3C,
  dimensionToLegacy,
  dimensionToPx,
} from "../../src/normalize/dimension";
import type { W3CDimensionValue } from "../../src/types/w3c";

describe("Dimension Normalizer", () => {
  describe("normalizeDimensionValue", () => {
    it("should pass through W3C dimension unchanged", () => {
      const w3c: W3CDimensionValue = { value: 16, unit: "px" };
      const result = normalizeDimensionValue(w3c);
      expect(result).toEqual(w3c);
    });

    it("should pass through W3C dimension with rem", () => {
      const w3c: W3CDimensionValue = { value: 1, unit: "rem" };
      const result = normalizeDimensionValue(w3c);
      expect(result).toEqual(w3c);
    });

    it("should normalize px string", () => {
      const result = normalizeDimensionValue("16px");
      expect(result).toBe("16px");
    });

    it("should normalize rem string", () => {
      const result = normalizeDimensionValue("1rem");
      expect(result).toBe("1rem");
    });

    it("should normalize negative values", () => {
      const result = normalizeDimensionValue("-8px");
      expect(result).toBe("-8px");
    });

    it("should normalize decimal values", () => {
      const result = normalizeDimensionValue("1.5rem");
      expect(result).toBe("1.5rem");
    });

    it("should pass through token alias unchanged", () => {
      const result = normalizeDimensionValue("{spacing.md}");
      expect(result).toBe("{spacing.md}");
    });

    it("should throw for invalid W3C value type", () => {
      // isW3CDimensionValue returns false for non-number value, so it's treated as invalid dimension
      const invalid = { value: "16", unit: "px" };
      expect(() => normalizeDimensionValue(invalid)).toThrow("not a valid DTFM dimension value");
    });

    it("should throw for invalid W3C unit", () => {
      // Object with value/unit but invalid W3C unit
      const invalid = { value: 16, unit: "em" };
      expect(() => normalizeDimensionValue(invalid)).toThrow("W3C spec only allows");
    });

    it("should throw for invalid string format", () => {
      expect(() => normalizeDimensionValue("16em")).toThrow("W3C spec only allows");
    });
  });

  describe("destructDimensionValue", () => {
    it("should destruct W3C dimension", () => {
      const w3c: W3CDimensionValue = { value: 16, unit: "px" };
      const result = destructDimensionValue(w3c);
      expect(result).toEqual({ number: 16, unit: "px" });
    });

    it("should destruct legacy dimension", () => {
      const result = destructDimensionValue("16px" as any);
      expect(result).toEqual({ number: 16, unit: "px" });
    });

    it("should destruct decimal values", () => {
      const result = destructDimensionValue("1.5rem" as any);
      expect(result).toEqual({ number: 1.5, unit: "rem" });
    });
  });

  describe("dimensionToW3C", () => {
    it("should pass through W3C dimension unchanged", () => {
      const w3c: W3CDimensionValue = { value: 16, unit: "px" };
      expect(dimensionToW3C(w3c)).toEqual(w3c);
    });

    it("should convert px string to W3C", () => {
      const result = dimensionToW3C("16px");
      expect(result).toEqual({ value: 16, unit: "px" });
    });

    it("should convert rem string to W3C", () => {
      const result = dimensionToW3C("1.5rem");
      expect(result).toEqual({ value: 1.5, unit: "rem" });
    });

    it("should handle negative values", () => {
      const result = dimensionToW3C("-8px");
      expect(result).toEqual({ value: -8, unit: "px" });
    });

    it("should throw for non-string", () => {
      expect(() => dimensionToW3C(123 as any)).toThrow("Cannot convert");
    });

    it("should throw for invalid string", () => {
      expect(() => dimensionToW3C("16em")).toThrow("Invalid dimension string");
    });
  });

  describe("dimensionToLegacy", () => {
    it("should pass through string unchanged", () => {
      expect(dimensionToLegacy("16px")).toBe("16px");
    });

    it("should convert W3C to string", () => {
      const w3c: W3CDimensionValue = { value: 16, unit: "px" };
      expect(dimensionToLegacy(w3c)).toBe("16px");
    });

    it("should convert W3C rem to string", () => {
      const w3c: W3CDimensionValue = { value: 1.5, unit: "rem" };
      expect(dimensionToLegacy(w3c)).toBe("1.5rem");
    });

    it("should throw for invalid type", () => {
      expect(() => dimensionToLegacy(123 as any)).toThrow("Cannot convert");
    });
  });

  describe("dimensionToPx", () => {
    it("should return px value unchanged", () => {
      expect(dimensionToPx("16px")).toBe(16);
    });

    it("should convert rem to px with default 16px base", () => {
      expect(dimensionToPx("1rem")).toBe(16);
      expect(dimensionToPx("2rem")).toBe(32);
    });

    it("should convert rem to px with custom base", () => {
      expect(dimensionToPx("1rem", { remSize: 20 })).toBe(20);
      expect(dimensionToPx("2rem", { remSize: 20 })).toBe(40);
    });

    it("should work with W3C format", () => {
      const w3c: W3CDimensionValue = { value: 16, unit: "px" };
      expect(dimensionToPx(w3c)).toBe(16);
    });
  });
});
