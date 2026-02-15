/**
 * Transition Normalizer Tests
 *
 * Tests for transition and cubic-bezier value normalization.
 */
import { describe, expect, it } from "bun:test";
import {
  normalizeCubicBezierValue,
  normalizeTransitionValue,
} from "../../src/normalize/transition";

describe("Transition Normalizer", () => {
  describe("normalizeCubicBezierValue", () => {
    it("should normalize valid cubic bezier", () => {
      const result = normalizeCubicBezierValue([0, 0, 1, 1]);
      expect(result).toEqual([0, 0, 1, 1]);
    });

    it("should clamp x values to 0-1 range", () => {
      const result = normalizeCubicBezierValue([-0.5, 0, 1.5, 1]);
      expect(result).toEqual([0, 0, 1, 1]);
    });

    it("should allow y values outside 0-1", () => {
      const result = normalizeCubicBezierValue([0, -0.5, 1, 1.5]);
      expect(result).toEqual([0, -0.5, 1, 1.5]);
    });

    it("should pass through token alias unchanged", () => {
      const result = normalizeCubicBezierValue("{easing.ease}");
      expect(result).toBe("{easing.ease}");
    });

    it("should accept CSS easing keywords", () => {
      // "ease" is a valid CSS easing keyword and should return its cubic-bezier values
      const result = normalizeCubicBezierValue("ease");
      expect(result).toEqual([0.25, 0.1, 0.25, 1]);
    });

    it("should throw for invalid string", () => {
      expect(() => normalizeCubicBezierValue("invalid-string")).toThrow(
        "Invalid timing function string"
      );
    });

    it("should throw for wrong array length", () => {
      expect(() => normalizeCubicBezierValue([0, 0, 1])).toThrow(
        "not a valid DTFM cubicBezier value"
      );
    });

    it("should throw for non-number values", () => {
      expect(() => normalizeCubicBezierValue([0, "0", 1, 1])).toThrow(
        "not a valid DTFM cubicBezier value"
      );
    });
  });

  describe("normalizeTransitionValue", () => {
    it("should normalize transition with all properties", () => {
      const transition = {
        duration: "200ms",
        timingFunction: [0, 0, 1, 1],
        delay: "100ms",
      };
      const result = normalizeTransitionValue(transition);
      expect((result as any).duration).toBe("200ms");
      expect((result as any).timingFunction).toEqual([0, 0, 1, 1]);
      expect((result as any).delay).toBe("100ms");
    });

    it("should default delay to 0ms", () => {
      const transition = {
        duration: "200ms",
        timingFunction: [0, 0, 1, 1],
      };
      const result = normalizeTransitionValue(transition);
      expect((result as any).delay).toBe("0ms");
    });

    it("should handle W3C duration format", () => {
      const transition = {
        duration: { value: 200, unit: "ms" },
        timingFunction: [0, 0, 1, 1],
        delay: { value: 0, unit: "ms" },
      };
      const result = normalizeTransitionValue(transition);
      expect((result as any).duration).toEqual({ value: 200, unit: "ms" });
    });

    it("should throw for non-object value", () => {
      expect(() => normalizeTransitionValue("200ms ease")).toThrow(
        "not a valid DTFM transition value"
      );
    });

    it("should throw for array value", () => {
      expect(() => normalizeTransitionValue([200, "ease"])).toThrow(
        "not a valid DTFM transition value"
      );
    });

    it("should throw for missing duration", () => {
      const transition = {
        timingFunction: [0, 0, 1, 1],
      };
      expect(() => normalizeTransitionValue(transition)).toThrow(
        "duration is required"
      );
    });

    it("should throw for missing timingFunction", () => {
      const transition = {
        duration: "200ms",
      };
      expect(() => normalizeTransitionValue(transition)).toThrow(
        "timingFunction is required"
      );
    });
  });
});
