/**
 * Color Spaces Tests
 *
 * Tests for W3C color space support and conversions.
 */
import { describe, expect, it } from "bun:test";
import {
  W3C_TO_CULORI_MODE,
  CULORI_MODE_TO_W3C,
  COLOR_SPACE_COMPONENTS,
  getColorSpaceConverter,
  parseColor,
  w3cColorToCulori,
  culoriToW3CColor,
  convertColorSpace,
  formatW3CColorToCSS,
  parseCSSToW3CColor,
  isValidColorSpace,
  getSupportedColorSpaces,
  isInGamut,
  clampToGamut,
  interpolateColors,
} from "../../src/color/spaces";
import type { W3CColorValue, W3CColorSpace } from "../../src/types/w3c";

describe("Color Spaces", () => {
  describe("Color Space Mappings", () => {
    it("should have all 14 W3C color spaces mapped to Culori", () => {
      const expectedSpaces: W3CColorSpace[] = [
        "srgb",
        "srgb-linear",
        "hsl",
        "hwb",
        "lab",
        "lch",
        "oklab",
        "oklch",
        "display-p3",
        "a98-rgb",
        "prophoto-rgb",
        "rec2020",
        "xyz-d50",
        "xyz-d65",
      ];

      expect(Object.keys(W3C_TO_CULORI_MODE).sort()).toEqual(expectedSpaces.sort());
    });

    it("should have correct Culori mode mappings", () => {
      expect(W3C_TO_CULORI_MODE.srgb).toBe("rgb");
      expect(W3C_TO_CULORI_MODE["srgb-linear"]).toBe("lrgb");
      expect(W3C_TO_CULORI_MODE["display-p3"]).toBe("p3");
      expect(W3C_TO_CULORI_MODE.oklch).toBe("oklch");
    });

    it("should have reverse mappings for all Culori modes", () => {
      expect(CULORI_MODE_TO_W3C.rgb).toBe("srgb");
      expect(CULORI_MODE_TO_W3C.lrgb).toBe("srgb-linear");
      expect(CULORI_MODE_TO_W3C.p3).toBe("display-p3");
    });

    it("should have correct component names for each color space", () => {
      expect(COLOR_SPACE_COMPONENTS.srgb).toEqual(["r", "g", "b"]);
      expect(COLOR_SPACE_COMPONENTS.hsl).toEqual(["h", "s", "l"]);
      expect(COLOR_SPACE_COMPONENTS.lab).toEqual(["l", "a", "b"]);
      expect(COLOR_SPACE_COMPONENTS.oklch).toEqual(["l", "c", "h"]);
      expect(COLOR_SPACE_COMPONENTS["xyz-d65"]).toEqual(["x", "y", "z"]);
    });
  });

  describe("getColorSpaceConverter", () => {
    it("should return a converter function for each color space", () => {
      const spaces: W3CColorSpace[] = ["srgb", "oklch", "lab", "display-p3"];

      for (const space of spaces) {
        const converter = getColorSpaceConverter(space);
        expect(typeof converter).toBe("function");
      }
    });
  });

  describe("parseColor", () => {
    it("should parse hex colors", () => {
      const color = parseColor("#ff0000");
      expect(color).toBeDefined();
      expect(color?.mode).toBe("rgb");
    });

    it("should parse rgb() colors", () => {
      const color = parseColor("rgb(255, 0, 0)");
      expect(color).toBeDefined();
    });

    it("should parse hsl() colors", () => {
      const color = parseColor("hsl(0, 100%, 50%)");
      expect(color).toBeDefined();
    });

    it("should parse named colors", () => {
      const color = parseColor("red");
      expect(color).toBeDefined();
    });

    it("should return undefined for invalid colors", () => {
      const color = parseColor("not-a-color");
      expect(color).toBeUndefined();
    });
  });

  describe("w3cColorToCulori", () => {
    it("should convert sRGB W3C color to Culori", () => {
      const w3cColor: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
      };
      const culoriColor = w3cColorToCulori(w3cColor);
      expect(culoriColor.mode).toBe("rgb");
    });

    it("should handle alpha channel", () => {
      const w3cColor: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
        alpha: 0.5,
      };
      const culoriColor = w3cColorToCulori(w3cColor);
      expect(culoriColor.alpha).toBe(0.5);
    });

    it("should handle none components", () => {
      const w3cColor: W3CColorValue = {
        colorSpace: "hsl",
        components: ["none", 0.5, 0.5],
      };
      const culoriColor = w3cColorToCulori(w3cColor);
      expect(culoriColor.mode).toBe("hsl");
    });

    it("should convert oklch color", () => {
      const w3cColor: W3CColorValue = {
        colorSpace: "oklch",
        components: [0.7, 0.15, 30],
      };
      const culoriColor = w3cColorToCulori(w3cColor);
      expect(culoriColor.mode).toBe("oklch");
    });
  });

  describe("culoriToW3CColor", () => {
    it("should convert Culori color to W3C format", () => {
      const parsed = parseColor("#ff0000");
      const w3cColor = culoriToW3CColor(parsed!);

      expect(w3cColor.colorSpace).toBe("srgb");
      expect(w3cColor.components).toHaveLength(3);
    });

    it("should add hex for sRGB colors", () => {
      const parsed = parseColor("#ff0000");
      const w3cColor = culoriToW3CColor(parsed!);

      expect(w3cColor.hex).toBeDefined();
      expect(w3cColor.hex).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it("should convert to target color space", () => {
      const parsed = parseColor("#ff0000");
      const w3cColor = culoriToW3CColor(parsed!, "oklch");

      expect(w3cColor.colorSpace).toBe("oklch");
    });

    it("should include alpha when less than 1", () => {
      const parsed = parseColor("rgba(255, 0, 0, 0.5)");
      const w3cColor = culoriToW3CColor(parsed!);

      expect(w3cColor.alpha).toBe(0.5);
    });
  });

  describe("convertColorSpace", () => {
    it("should return same color if already in target space", () => {
      const color: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
      };
      const result = convertColorSpace(color, "srgb");

      expect(result).toEqual(color);
    });

    it("should convert sRGB to OKLCH", () => {
      const color: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
      };
      const result = convertColorSpace(color, "oklch");

      expect(result.colorSpace).toBe("oklch");
      expect(result.components).toHaveLength(3);
    });

    it("should convert OKLCH to sRGB", () => {
      const color: W3CColorValue = {
        colorSpace: "oklch",
        components: [0.6279, 0.2577, 29.23],
      };
      const result = convertColorSpace(color, "srgb");

      expect(result.colorSpace).toBe("srgb");
    });
  });

  describe("formatW3CColorToCSS", () => {
    it("should format sRGB with hex as hex string", () => {
      const color: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
        hex: "#ff0000",
      };
      const css = formatW3CColorToCSS(color);

      expect(css).toBe("#ff0000");
    });

    it("should format sRGB without hex using Culori", () => {
      const color: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
      };
      const css = formatW3CColorToCSS(color);

      expect(css).toBeTruthy();
    });

    it("should format OKLCH colors", () => {
      const color: W3CColorValue = {
        colorSpace: "oklch",
        components: [0.7, 0.15, 30],
      };
      const css = formatW3CColorToCSS(color);

      expect(css).toBeTruthy();
    });
  });

  describe("parseCSSToW3CColor", () => {
    it("should parse CSS hex to W3C color", () => {
      const color = parseCSSToW3CColor("#ff0000");

      expect(color).toBeDefined();
      expect(color?.colorSpace).toBe("srgb");
    });

    it("should parse to specified color space", () => {
      const color = parseCSSToW3CColor("#ff0000", "oklch");

      expect(color?.colorSpace).toBe("oklch");
    });

    it("should return undefined for invalid CSS", () => {
      const color = parseCSSToW3CColor("not-a-color");

      expect(color).toBeUndefined();
    });
  });

  describe("isValidColorSpace", () => {
    it("should return true for all 14 valid color spaces", () => {
      const spaces: W3CColorSpace[] = [
        "srgb",
        "srgb-linear",
        "hsl",
        "hwb",
        "lab",
        "lch",
        "oklab",
        "oklch",
        "display-p3",
        "a98-rgb",
        "prophoto-rgb",
        "rec2020",
        "xyz-d50",
        "xyz-d65",
      ];

      for (const space of spaces) {
        expect(isValidColorSpace(space)).toBe(true);
      }
    });

    it("should return false for invalid color spaces", () => {
      expect(isValidColorSpace("invalid")).toBe(false);
      expect(isValidColorSpace("rgb")).toBe(false);
      expect(isValidColorSpace("cmyk")).toBe(false);
    });
  });

  describe("getSupportedColorSpaces", () => {
    it("should return all 14 color spaces", () => {
      const spaces = getSupportedColorSpaces();

      expect(spaces).toHaveLength(14);
      expect(spaces).toContain("srgb");
      expect(spaces).toContain("oklch");
    });
  });

  describe("isInGamut", () => {
    it("should return true for in-gamut sRGB colors", () => {
      const color: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0.5, 0],
      };

      expect(isInGamut(color)).toBe(true);
    });

    it("should return false for out-of-gamut sRGB colors", () => {
      const color: W3CColorValue = {
        colorSpace: "srgb",
        components: [1.2, -0.1, 0],
      };

      expect(isInGamut(color)).toBe(false);
    });

    it("should return true for colors with none components", () => {
      const color: W3CColorValue = {
        colorSpace: "srgb",
        components: ["none", 0.5, 0.5],
      };

      expect(isInGamut(color)).toBe(true);
    });

    it("should return true for non-RGB color spaces", () => {
      const color: W3CColorValue = {
        colorSpace: "lab",
        components: [50, 100, -100],
      };

      expect(isInGamut(color)).toBe(true);
    });
  });

  describe("clampToGamut", () => {
    it("should clamp out-of-gamut RGB values", () => {
      const color: W3CColorValue = {
        colorSpace: "srgb",
        components: [1.2, -0.1, 0.5],
      };
      const clamped = clampToGamut(color);

      expect(clamped.components[0]).toBe(1);
      expect(clamped.components[1]).toBe(0);
      expect(clamped.components[2]).toBe(0.5);
    });

    it("should not modify in-gamut colors", () => {
      const color: W3CColorValue = {
        colorSpace: "srgb",
        components: [0.5, 0.5, 0.5],
      };
      const clamped = clampToGamut(color);

      expect(clamped.components).toEqual([0.5, 0.5, 0.5]);
    });

    it("should preserve none components", () => {
      const color: W3CColorValue = {
        colorSpace: "srgb",
        components: ["none", 1.5, 0.5],
      };
      const clamped = clampToGamut(color);

      expect(clamped.components[0]).toBe("none");
      expect(clamped.components[1]).toBe(1);
    });

    it("should not clamp non-RGB color spaces", () => {
      const color: W3CColorValue = {
        colorSpace: "lab",
        components: [150, 200, -200],
      };
      const clamped = clampToGamut(color);

      expect(clamped).toEqual(color);
    });
  });

  describe("interpolateColors", () => {
    it("should interpolate between two colors", () => {
      const color1: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
      };
      const color2: W3CColorValue = {
        colorSpace: "srgb",
        components: [0, 0, 1],
      };

      const result = interpolateColors(color1, color2, 0.5);

      expect(result).toBeDefined();
      expect(result.colorSpace).toBe("oklch"); // default interpolation space
    });

    it("should return first color at t=0", () => {
      const color1: W3CColorValue = {
        colorSpace: "oklch",
        components: [0.7, 0.15, 30],
      };
      const color2: W3CColorValue = {
        colorSpace: "oklch",
        components: [0.5, 0.1, 180],
      };

      const result = interpolateColors(color1, color2, 0, "oklch");

      expect(result.components[0]).toBeCloseTo(0.7, 5);
      expect(result.components[1]).toBeCloseTo(0.15, 5);
    });

    it("should return second color at t=1", () => {
      const color1: W3CColorValue = {
        colorSpace: "oklch",
        components: [0.7, 0.15, 30],
      };
      const color2: W3CColorValue = {
        colorSpace: "oklch",
        components: [0.5, 0.1, 180],
      };

      const result = interpolateColors(color1, color2, 1, "oklch");

      expect(result.components[0]).toBeCloseTo(0.5, 5);
      expect(result.components[1]).toBeCloseTo(0.1, 5);
    });

    it("should handle none components", () => {
      const color1: W3CColorValue = {
        colorSpace: "oklch",
        components: ["none", 0.15, 30],
      };
      const color2: W3CColorValue = {
        colorSpace: "oklch",
        components: [0.5, 0.1, 180],
      };

      const result = interpolateColors(color1, color2, 0.5, "oklch");

      expect(result).toBeDefined();
    });

    it("should interpolate alpha", () => {
      const color1: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
        alpha: 1,
      };
      const color2: W3CColorValue = {
        colorSpace: "srgb",
        components: [0, 0, 1],
        alpha: 0,
      };

      const result = interpolateColors(color1, color2, 0.5);

      expect(result.alpha).toBeCloseTo(0.5, 5);
    });
  });
});
