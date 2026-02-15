/**
 * Border Normalizer Tests
 *
 * Tests for border value normalization.
 */
import { describe, expect, it } from "bun:test";
import { normalizeBorderValue } from "../../src/normalize/border";

describe("Border Normalizer", () => {
  describe("normalizeBorderValue", () => {
    it("should normalize border object", () => {
      const border = {
        color: "#000000",
        width: "1px",
        style: "solid",
      };
      const result = normalizeBorderValue(border);
      expect(result).toEqual({
        color: "#000000",
        width: "1px",
        style: "solid",
      });
    });

    it("should normalize border with W3C color", () => {
      const border = {
        color: { colorSpace: "srgb", components: [0, 0, 0] },
        width: "1px",
        style: "solid",
      };
      const result = normalizeBorderValue(border);
      expect((result as any).color.colorSpace).toBe("srgb");
    });

    it("should normalize border with W3C dimension", () => {
      const border = {
        color: "#000000",
        width: { value: 1, unit: "px" },
        style: "solid",
      };
      const result = normalizeBorderValue(border);
      expect((result as any).width).toEqual({ value: 1, unit: "px" });
    });

    it("should normalize border with object stroke style", () => {
      const border = {
        color: "#000000",
        width: "1px",
        style: {
          dashArray: ["10px", "5px"],
          lineCap: "round",
        },
      };
      const result = normalizeBorderValue(border);
      expect((result as any).style.lineCap).toBe("round");
    });

    it("should pass through token alias unchanged", () => {
      const result = normalizeBorderValue("{borders.default}");
      expect(result).toBe("{borders.default}");
    });

    it("should throw for non-object value", () => {
      expect(() => normalizeBorderValue("solid")).toThrow("not a valid DTFM border value");
    });

    it("should throw for missing color", () => {
      const border = { width: "1px", style: "solid" };
      expect(() => normalizeBorderValue(border)).toThrow('missing required "color" property');
    });

    it("should throw for missing width", () => {
      const border = { color: "#000000", style: "solid" };
      expect(() => normalizeBorderValue(border)).toThrow('missing required "width" property');
    });

    it("should throw for missing style", () => {
      const border = { color: "#000000", width: "1px" };
      expect(() => normalizeBorderValue(border)).toThrow('missing required "style" property');
    });
  });
});
