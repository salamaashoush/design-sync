/**
 * "none" Keyword Tests
 *
 * Tests for W3C "none" keyword handling in color components.
 */
import { describe, expect, it } from "bun:test";
import {
  isNoneComponent,
  hasNoneComponents,
  getNoneComponents,
  replaceNoneComponents,
  shouldHueBeNone,
  applyNoneToPowerless,
  isAlphaPowerless,
  getEffectiveValue,
  withNoneComponents,
  preserveNoneInConversion,
} from "../../src/color/none";
import type { W3CColorValue } from "../../src/types/w3c";

describe("Color None Keyword", () => {
  describe("isNoneComponent", () => {
    it('should return true for "none" string', () => {
      expect(isNoneComponent("none")).toBe(true);
    });

    it("should return false for numbers", () => {
      expect(isNoneComponent(0)).toBe(false);
      expect(isNoneComponent(0.5)).toBe(false);
      expect(isNoneComponent(1)).toBe(false);
    });
  });

  describe("hasNoneComponents", () => {
    it("should return true if any component is none", () => {
      const color: W3CColorValue = {
        colorSpace: "hsl",
        components: ["none", 0.5, 0.5],
      };
      expect(hasNoneComponents(color)).toBe(true);
    });

    it("should return true if alpha is none", () => {
      const color: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
        alpha: "none",
      };
      expect(hasNoneComponents(color)).toBe(true);
    });

    it("should return false if no components are none", () => {
      const color: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
      };
      expect(hasNoneComponents(color)).toBe(false);
    });

    it("should return false if alpha is a number", () => {
      const color: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
        alpha: 0.5,
      };
      expect(hasNoneComponents(color)).toBe(false);
    });
  });

  describe("getNoneComponents", () => {
    it("should return component names that are none", () => {
      const color: W3CColorValue = {
        colorSpace: "hsl",
        components: ["none", 0.5, 0.5],
      };
      const noneComponents = getNoneComponents(color);

      expect(noneComponents).toContain("h");
      expect(noneComponents).toHaveLength(1);
    });

    it("should include alpha if it is none", () => {
      const color: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
        alpha: "none",
      };
      const noneComponents = getNoneComponents(color);

      expect(noneComponents).toContain("alpha");
    });

    it("should return empty array if no components are none", () => {
      const color: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
      };
      const noneComponents = getNoneComponents(color);

      expect(noneComponents).toHaveLength(0);
    });

    it("should handle multiple none components", () => {
      const color: W3CColorValue = {
        colorSpace: "srgb",
        components: ["none", "none", 0.5],
      };
      const noneComponents = getNoneComponents(color);

      expect(noneComponents).toContain("r");
      expect(noneComponents).toContain("g");
      expect(noneComponents).toHaveLength(2);
    });
  });

  describe("replaceNoneComponents", () => {
    it("should replace none with default value (0)", () => {
      const color: W3CColorValue = {
        colorSpace: "hsl",
        components: ["none", 0.5, 0.5],
      };
      const result = replaceNoneComponents(color);

      expect(result.components[0]).toBe(0);
      expect(result.components[1]).toBe(0.5);
    });

    it("should replace none with custom fallback", () => {
      const color: W3CColorValue = {
        colorSpace: "hsl",
        components: ["none", 0.5, 0.5],
      };
      const result = replaceNoneComponents(color, 180);

      expect(result.components[0]).toBe(180);
    });

    it("should replace none alpha", () => {
      const color: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
        alpha: "none",
      };
      const result = replaceNoneComponents(color);

      expect(result.alpha).toBe(0);
    });

    it("should not modify numeric components", () => {
      const color: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0.5, 0],
      };
      const result = replaceNoneComponents(color);

      expect(result.components).toEqual([1, 0.5, 0]);
    });
  });

  describe("shouldHueBeNone", () => {
    it("should return true for HSL with zero saturation", () => {
      const color: W3CColorValue = {
        colorSpace: "hsl",
        components: [180, 0, 0.5],
      };
      expect(shouldHueBeNone(color)).toBe(true);
    });

    it("should return true for HSL with none saturation", () => {
      const color: W3CColorValue = {
        colorSpace: "hsl",
        components: [180, "none", 0.5],
      };
      expect(shouldHueBeNone(color)).toBe(true);
    });

    it("should return false for HSL with non-zero saturation", () => {
      const color: W3CColorValue = {
        colorSpace: "hsl",
        components: [180, 0.5, 0.5],
      };
      expect(shouldHueBeNone(color)).toBe(false);
    });

    it("should return true for HWB with whiteness + blackness >= 1", () => {
      const color: W3CColorValue = {
        colorSpace: "hwb",
        components: [180, 0.5, 0.5],
      };
      expect(shouldHueBeNone(color)).toBe(true);
    });

    it("should return false for HWB with whiteness + blackness < 1", () => {
      const color: W3CColorValue = {
        colorSpace: "hwb",
        components: [180, 0.3, 0.3],
      };
      expect(shouldHueBeNone(color)).toBe(false);
    });

    it("should return true for LCH with zero chroma", () => {
      const color: W3CColorValue = {
        colorSpace: "lch",
        components: [50, 0, 180],
      };
      expect(shouldHueBeNone(color)).toBe(true);
    });

    it("should return true for OKLCH with zero chroma", () => {
      const color: W3CColorValue = {
        colorSpace: "oklch",
        components: [0.7, 0, 180],
      };
      expect(shouldHueBeNone(color)).toBe(true);
    });

    it("should return false for sRGB (no hue)", () => {
      const color: W3CColorValue = {
        colorSpace: "srgb",
        components: [0.5, 0.5, 0.5],
      };
      expect(shouldHueBeNone(color)).toBe(false);
    });
  });

  describe("applyNoneToPowerless", () => {
    it("should set hue to none for HSL with zero saturation", () => {
      const color: W3CColorValue = {
        colorSpace: "hsl",
        components: [180, 0, 0.5],
      };
      const result = applyNoneToPowerless(color);

      expect(result.components[0]).toBe("none");
    });

    it("should set hue to none for OKLCH with zero chroma", () => {
      const color: W3CColorValue = {
        colorSpace: "oklch",
        components: [0.7, 0, 180],
      };
      const result = applyNoneToPowerless(color);

      expect(result.components[2]).toBe("none");
    });

    it("should not modify color if hue is not powerless", () => {
      const color: W3CColorValue = {
        colorSpace: "hsl",
        components: [180, 0.5, 0.5],
      };
      const result = applyNoneToPowerless(color);

      expect(result).toEqual(color);
    });

    it("should not modify sRGB colors", () => {
      const color: W3CColorValue = {
        colorSpace: "srgb",
        components: [0.5, 0.5, 0.5],
      };
      const result = applyNoneToPowerless(color);

      expect(result).toEqual(color);
    });
  });

  describe("isAlphaPowerless", () => {
    it("should return true for alpha = 0", () => {
      const color: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
        alpha: 0,
      };
      expect(isAlphaPowerless(color)).toBe(true);
    });

    it("should return false for alpha > 0", () => {
      const color: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
        alpha: 0.5,
      };
      expect(isAlphaPowerless(color)).toBe(false);
    });

    it("should return false for undefined alpha", () => {
      const color: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
      };
      expect(isAlphaPowerless(color)).toBe(false);
    });
  });

  describe("getEffectiveValue", () => {
    it('should return 0 for "none"', () => {
      expect(getEffectiveValue("none")).toBe(0);
    });

    it("should return the number value for numbers", () => {
      expect(getEffectiveValue(0.5)).toBe(0.5);
      expect(getEffectiveValue(1)).toBe(1);
      expect(getEffectiveValue(0)).toBe(0);
    });
  });

  describe("withNoneComponents", () => {
    it("should set specified indices to none", () => {
      const color: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0.5, 0],
      };
      const result = withNoneComponents(color, [0, 2]);

      expect(result.components[0]).toBe("none");
      expect(result.components[1]).toBe(0.5);
      expect(result.components[2]).toBe("none");
    });

    it("should set alpha to none when requested", () => {
      const color: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0.5, 0],
        alpha: 1,
      };
      const result = withNoneComponents(color, [], true);

      expect(result.alpha).toBe("none");
    });

    it("should preserve alpha when not requested to be none", () => {
      const color: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0.5, 0],
        alpha: 0.5,
      };
      const result = withNoneComponents(color, [0]);

      expect(result.alpha).toBe(0.5);
    });
  });

  describe("preserveNoneInConversion", () => {
    it("should preserve none hue when converting between hue-based spaces", () => {
      const original: W3CColorValue = {
        colorSpace: "hsl",
        components: ["none", 0, 0.5],
      };
      const converted: W3CColorValue = {
        colorSpace: "hwb",
        components: [180, 0.5, 0.5],
      };

      const result = preserveNoneInConversion(original, converted);

      expect(result.components[0]).toBe("none");
    });

    it("should preserve none alpha", () => {
      const original: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
        alpha: "none",
      };
      const converted: W3CColorValue = {
        colorSpace: "oklch",
        components: [0.6, 0.2, 30],
        alpha: 1,
      };

      const result = preserveNoneInConversion(original, converted);

      expect(result.alpha).toBe("none");
    });

    it("should not modify if original has no none components", () => {
      const original: W3CColorValue = {
        colorSpace: "hsl",
        components: [180, 0.5, 0.5],
      };
      const converted: W3CColorValue = {
        colorSpace: "oklch",
        components: [0.7, 0.15, 200],
      };

      const result = preserveNoneInConversion(original, converted);

      expect(result).toEqual(converted);
    });
  });
});
