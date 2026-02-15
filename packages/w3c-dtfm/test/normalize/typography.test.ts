/**
 * Typography Normalizer Tests
 *
 * Tests for typography and font value normalization.
 */
import { describe, expect, it } from "bun:test";
import {
  normalizeFontFamilyValue,
  normalizeFontWeightValue,
  normalizeTypographyValue,
} from "../../src/normalize/typography";

describe("Typography Normalizer", () => {
  describe("normalizeFontFamilyValue", () => {
    it("should normalize string to array", () => {
      const result = normalizeFontFamilyValue("Arial");
      expect(result).toEqual(["Arial"]);
    });

    it("should pass through array unchanged", () => {
      const result = normalizeFontFamilyValue(["Arial", "Helvetica", "sans-serif"]);
      expect(result).toEqual(["Arial", "Helvetica", "sans-serif"]);
    });

    it("should pass through token alias unchanged", () => {
      const result = normalizeFontFamilyValue("{fonts.body}");
      expect(result).toBe("{fonts.body}");
    });

    it("should throw for invalid type", () => {
      expect(() => normalizeFontFamilyValue(123)).toThrow(
        "not a valid DTFM font family value"
      );
    });

    it("should throw for mixed array", () => {
      expect(() => normalizeFontFamilyValue(["Arial", 123])).toThrow(
        "not a valid DTFM font family value"
      );
    });
  });

  describe("normalizeFontWeightValue", () => {
    it("should pass through number unchanged", () => {
      expect(normalizeFontWeightValue(400)).toBe(400);
      expect(normalizeFontWeightValue(700)).toBe(700);
    });

    it("should parse numeric string", () => {
      expect(normalizeFontWeightValue("400")).toBe(400);
      expect(normalizeFontWeightValue("700")).toBe(700);
    });

    it("should convert weight name to number", () => {
      expect(normalizeFontWeightValue("thin")).toBe(100);
      expect(normalizeFontWeightValue("light")).toBe(300);
      expect(normalizeFontWeightValue("normal")).toBe(400);
      expect(normalizeFontWeightValue("regular")).toBe(400);
      expect(normalizeFontWeightValue("medium")).toBe(500);
      expect(normalizeFontWeightValue("bold")).toBe(700);
      expect(normalizeFontWeightValue("black")).toBe(900);
    });

    it("should handle weight aliases", () => {
      expect(normalizeFontWeightValue("hairline")).toBe(100);
      expect(normalizeFontWeightValue("extra-light")).toBe(200);
      expect(normalizeFontWeightValue("extralight")).toBe(200);
      expect(normalizeFontWeightValue("ultra-light")).toBe(200);
      expect(normalizeFontWeightValue("semi-bold")).toBe(600);
      expect(normalizeFontWeightValue("semibold")).toBe(600);
      expect(normalizeFontWeightValue("demi-bold")).toBe(600);
      expect(normalizeFontWeightValue("extra-bold")).toBe(800);
      expect(normalizeFontWeightValue("extrabold")).toBe(800);
      expect(normalizeFontWeightValue("ultra-bold")).toBe(800);
      expect(normalizeFontWeightValue("heavy")).toBe(900);
      expect(normalizeFontWeightValue("extra-black")).toBe(950);
      expect(normalizeFontWeightValue("ultra-black")).toBe(950);
    });

    it("should pass through token alias unchanged", () => {
      const result = normalizeFontWeightValue("{weights.bold}");
      expect(result).toBe("{weights.bold}");
    });

    it("should throw for invalid type", () => {
      expect(() => normalizeFontWeightValue([])).toThrow(
        "not a valid DTFM font weight value"
      );
    });
  });

  describe("normalizeTypographyValue", () => {
    it("should normalize complete typography object", () => {
      const typography = {
        fontFamily: "Arial",
        fontSize: "16px",
        fontWeight: "bold",
        lineHeight: 1.5, // lineHeight should be a number, not a string
        letterSpacing: "0px",
      };
      const result = normalizeTypographyValue(typography);
      expect((result as any).fontFamily).toEqual(["Arial"]);
      expect((result as any).fontSize).toBe("16px");
      expect((result as any).fontWeight).toBe(700);
    });

    it("should normalize partial typography object", () => {
      const typography = {
        fontFamily: ["Roboto", "sans-serif"],
        fontSize: "14px",
      };
      const result = normalizeTypographyValue(typography);
      expect((result as any).fontFamily).toEqual(["Roboto", "sans-serif"]);
      expect((result as any).fontSize).toBe("14px");
    });

    it("should handle W3C dimension values", () => {
      const typography = {
        fontFamily: "Arial",
        fontSize: { value: 16, unit: "px" },
      };
      const result = normalizeTypographyValue(typography);
      expect((result as any).fontSize).toEqual({ value: 16, unit: "px" });
    });

    it("should pass through token aliases in properties", () => {
      const typography = {
        fontFamily: "{fonts.body}",
        fontSize: "{sizes.md}",
      };
      const result = normalizeTypographyValue(typography);
      expect((result as any).fontFamily).toBe("{fonts.body}");
      expect((result as any).fontSize).toBe("{sizes.md}");
    });

    it("should pass through token alias unchanged", () => {
      const result = normalizeTypographyValue("{typography.body}");
      expect(result).toBe("{typography.body}");
    });

    it("should throw for non-object value", () => {
      expect(() => normalizeTypographyValue("Arial 16px")).toThrow(
        "not a valid DTFM typography value"
      );
    });

    it("should throw for array value", () => {
      expect(() => normalizeTypographyValue(["Arial", "16px"])).toThrow(
        "not a valid DTFM typography value"
      );
    });

    it("should throw for empty object", () => {
      expect(() => normalizeTypographyValue({})).toThrow(
        "must contain at least one property"
      );
    });
  });
});
