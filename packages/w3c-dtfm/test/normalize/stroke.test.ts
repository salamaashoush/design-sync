/**
 * Stroke Style Normalizer Tests
 *
 * Tests for stroke style value normalization.
 */
import { describe, expect, it } from "bun:test";
import {
  normalizeStrokeStyleValue,
  isStrokeStyleString,
  isStrokeStyleObject,
} from "../../src/normalize/stroke";

describe("Stroke Style Normalizer", () => {
  describe("normalizeStrokeStyleValue", () => {
    it("should normalize string stroke styles", () => {
      expect(normalizeStrokeStyleValue("solid")).toBe("solid");
      expect(normalizeStrokeStyleValue("dashed")).toBe("dashed");
      expect(normalizeStrokeStyleValue("dotted")).toBe("dotted");
      expect(normalizeStrokeStyleValue("double")).toBe("double");
      expect(normalizeStrokeStyleValue("groove")).toBe("groove");
      expect(normalizeStrokeStyleValue("ridge")).toBe("ridge");
      expect(normalizeStrokeStyleValue("outset")).toBe("outset");
      expect(normalizeStrokeStyleValue("inset")).toBe("inset");
    });

    it("should normalize W3C object stroke style", () => {
      const strokeStyle = {
        dashArray: [{ value: 10, unit: "px" }, { value: 5, unit: "px" }],
        lineCap: "round",
      };
      const result = normalizeStrokeStyleValue(strokeStyle);
      expect((result as any).lineCap).toBe("round");
      expect((result as any).dashArray).toHaveLength(2);
    });

    it("should normalize legacy object with string dimensions", () => {
      const strokeStyle = {
        dashArray: ["10px", "5px"],
        lineCap: "butt",
      };
      const result = normalizeStrokeStyleValue(strokeStyle);
      expect((result as any).lineCap).toBe("butt");
      expect((result as any).dashArray).toHaveLength(2);
    });

    it("should accept square lineCap", () => {
      const strokeStyle = {
        dashArray: ["10px"],
        lineCap: "square",
      };
      const result = normalizeStrokeStyleValue(strokeStyle);
      expect((result as any).lineCap).toBe("square");
    });

    it("should pass through token alias unchanged", () => {
      const result = normalizeStrokeStyleValue("{strokes.dashed}");
      expect(result).toBe("{strokes.dashed}");
    });

    it("should throw for invalid string style", () => {
      expect(() => normalizeStrokeStyleValue("wavy")).toThrow("not a valid DTFM stroke style");
    });

    it("should throw for invalid lineCap", () => {
      const strokeStyle = {
        dashArray: ["10px"],
        lineCap: "invalid",
      };
      expect(() => normalizeStrokeStyleValue(strokeStyle)).toThrow("Invalid lineCap");
    });

    it("should throw for non-array dashArray", () => {
      const strokeStyle = {
        dashArray: "10px",
        lineCap: "round",
      };
      expect(() => normalizeStrokeStyleValue(strokeStyle)).toThrow(
        "dashArray must be an array"
      );
    });
  });

  describe("isStrokeStyleString", () => {
    it("should return true for string styles", () => {
      expect(isStrokeStyleString("solid")).toBe(true);
      expect(isStrokeStyleString("dashed")).toBe(true);
    });

    it("should return false for object styles", () => {
      const strokeStyle = {
        dashArray: [{ value: 10, unit: "px" }],
        lineCap: "round",
      };
      expect(isStrokeStyleString(strokeStyle as any)).toBe(false);
    });
  });

  describe("isStrokeStyleObject", () => {
    it("should return true for object styles", () => {
      const strokeStyle = {
        dashArray: [{ value: 10, unit: "px" }],
        lineCap: "round",
      };
      expect(isStrokeStyleObject(strokeStyle as any)).toBe(true);
    });

    it("should return false for string styles", () => {
      expect(isStrokeStyleObject("solid")).toBe(false);
    });
  });
});
