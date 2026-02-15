/**
 * Gradient Normalizer Tests
 *
 * Tests for gradient value normalization.
 */
import { describe, expect, it } from "bun:test";
import { normalizeGradientValue } from "../../src/normalize/gradient";

describe("Gradient Normalizer", () => {
  describe("normalizeGradientValue", () => {
    it("should normalize gradient with positions", () => {
      const gradient = [
        { color: "#ff0000", position: 0 },
        { color: "#0000ff", position: 1 },
      ];
      const result = normalizeGradientValue(gradient);
      expect((result as any)[0].color).toBe("#ff0000");
      expect((result as any)[0].position).toBe(0);
      expect((result as any)[1].color).toBe("#0000ff");
      expect((result as any)[1].position).toBe(1);
    });

    it("should normalize gradient without positions", () => {
      const gradient = [{ color: "#ff0000" }, { color: "#0000ff" }];
      const result = normalizeGradientValue(gradient);
      expect((result as any)[0].position).toBeUndefined();
      expect((result as any)[1].position).toBeUndefined();
    });

    it("should clamp positions to 0-1 range", () => {
      const gradient = [
        { color: "#ff0000", position: -0.5 },
        { color: "#0000ff", position: 1.5 },
      ];
      const result = normalizeGradientValue(gradient);
      expect((result as any)[0].position).toBe(0);
      expect((result as any)[1].position).toBe(1);
    });

    it("should normalize W3C color values", () => {
      const gradient = [
        { color: { colorSpace: "srgb", components: [1, 0, 0] }, position: 0 },
        { color: { colorSpace: "srgb", components: [0, 0, 1] }, position: 1 },
      ];
      const result = normalizeGradientValue(gradient);
      expect((result as any)[0].color.colorSpace).toBe("srgb");
    });

    it("should pass through token alias unchanged", () => {
      const result = normalizeGradientValue("{gradients.primary}");
      expect(result).toBe("{gradients.primary}");
    });

    it("should throw for single stop object without stops array", () => {
      expect(() => normalizeGradientValue({ color: "#ff0000" })).toThrow(
        "Single gradient stop detected"
      );
    });

    it("should throw for null", () => {
      expect(() => normalizeGradientValue(null)).toThrow(
        "not a valid DTFM gradient value"
      );
    });

    it("should throw for stops without color", () => {
      const gradient = [{ position: 0 }, { color: "#0000ff", position: 1 }];
      expect(() => normalizeGradientValue(gradient)).toThrow(
        "Gradient stops must be objects with a color property"
      );
    });

    it("should handle single stop gradient", () => {
      const gradient = [{ color: "#ff0000", position: 0.5 }];
      const result = normalizeGradientValue(gradient);
      expect((result as any).length).toBe(1);
    });

    it("should handle multi-stop gradient", () => {
      const gradient = [
        { color: "#ff0000", position: 0 },
        { color: "#00ff00", position: 0.5 },
        { color: "#0000ff", position: 1 },
      ];
      const result = normalizeGradientValue(gradient);
      expect((result as any).length).toBe(3);
    });
  });
});
