/**
 * Shadow Normalizer Tests
 *
 * Tests for shadow value normalization.
 */
import { describe, expect, it } from "bun:test";
import { normalizeShadowValue } from "../../src/normalize/shadow";

describe("Shadow Normalizer", () => {
  describe("normalizeShadowValue", () => {
    it("should normalize single shadow object", () => {
      const shadow = {
        offsetX: "0px",
        offsetY: "2px",
        blur: "4px",
        spread: "0px",
        color: "#000000",
      };
      const result = normalizeShadowValue(shadow);
      expect(Array.isArray(result)).toBe(true);
      expect((result as any)[0].offsetX).toBe("0px");
      expect((result as any)[0].offsetY).toBe("2px");
      expect((result as any)[0].blur).toBe("4px");
      expect((result as any)[0].spread).toBe("0px");
    });

    it("should normalize shadow array", () => {
      const shadows = [
        {
          offsetX: "0px",
          offsetY: "2px",
          blur: "4px",
          spread: "0px",
          color: "#000000",
        },
        {
          offsetX: "0px",
          offsetY: "4px",
          blur: "8px",
          spread: "0px",
          color: "#333333",
        },
      ];
      const result = normalizeShadowValue(shadows);
      expect(Array.isArray(result)).toBe(true);
      expect((result as any).length).toBe(2);
    });

    it("should handle zero values", () => {
      const shadow = {
        offsetX: 0,
        offsetY: 0,
        blur: "4px",
        spread: "0px",
        color: "#000000",
      };
      const result = normalizeShadowValue(shadow);
      expect((result as any)[0].offsetX).toBe("0px");
      expect((result as any)[0].offsetY).toBe("0px");
    });

    it("should handle explicit zero values", () => {
      const shadow = {
        offsetX: "0px",
        offsetY: "0px",
        blur: "0px",
        spread: "0px",
        color: "#000000",
      };
      const result = normalizeShadowValue(shadow);
      expect((result as any)[0].offsetX).toBe("0px");
      expect((result as any)[0].offsetY).toBe("0px");
      expect((result as any)[0].blur).toBe("0px");
      expect((result as any)[0].spread).toBe("0px");
    });

    it("should pass through token alias unchanged", () => {
      const result = normalizeShadowValue("{shadows.md}");
      expect(result).toBe("{shadows.md}");
    });

    it("should throw for invalid value type", () => {
      expect(() => normalizeShadowValue("not-a-shadow")).toThrow();
    });

    it("should throw for null", () => {
      expect(() => normalizeShadowValue(null)).toThrow("not a valid DTFM shadow value");
    });

    it("should throw for number", () => {
      expect(() => normalizeShadowValue(123)).toThrow("not a valid DTFM shadow value");
    });

    it("should normalize W3C color values in shadow", () => {
      const shadow = {
        offsetX: "0px",
        offsetY: "2px",
        blur: "4px",
        spread: "0px",
        color: {
          colorSpace: "srgb",
          components: [0, 0, 0],
          alpha: 0.5,
        },
      };
      const result = normalizeShadowValue(shadow);
      expect((result as any)[0].color).toBeDefined();
    });

    it("should normalize W3C dimension values in shadow", () => {
      const shadow = {
        offsetX: "0px",
        offsetY: "2px",
        blur: { value: 4, unit: "px" },
        spread: { value: 0, unit: "px" },
        color: "#000000",
      };
      const result = normalizeShadowValue(shadow);
      expect((result as any)[0].offsetX).toBe("0px");
      expect((result as any)[0].offsetY).toBe("2px");
      expect((result as any)[0].blur).toEqual({ value: 4, unit: "px" });
      expect((result as any)[0].spread).toEqual({ value: 0, unit: "px" });
    });
  });
});
