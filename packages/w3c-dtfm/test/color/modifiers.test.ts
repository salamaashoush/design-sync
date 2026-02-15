/**
 * Color Modifiers Tests
 *
 * Tests for color modification functions.
 */
import { describe, expect, it } from "bun:test";
import {
  toColor,
  lightenColor,
  darkenColor,
  saturateColor,
  desaturateColor,
  opacifyColor,
  contrastColor,
  hueRotateColor,
  invertColor,
  grayscaleColor,
  sepiaColor,
  parseModifierValue,
  applyColorModifier,
  applyColorModifiers,
  formatColor,
  applyModifiersToW3CColor,
  mixColors,
  getLuminance,
  getContrastRatio,
  meetsContrastRequirement,
} from "../../src/color/modifiers";
import type { W3CColorValue } from "../../src/types/w3c";

describe("Color Modifiers", () => {
  describe("toColor", () => {
    it("should parse hex string", () => {
      const color = toColor("#ff0000");
      expect(color).toBeDefined();
    });

    it("should parse rgb string", () => {
      const color = toColor("rgb(255, 0, 0)");
      expect(color).toBeDefined();
    });

    it("should parse W3C color value", () => {
      const w3c: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
      };
      const color = toColor(w3c);
      expect(color).toBeDefined();
    });

    it("should pass through Culori color", () => {
      const culori = { mode: "rgb", r: 1, g: 0, b: 0 } as const;
      const color = toColor(culori);
      expect(color).toEqual(culori);
    });

    it("should throw for invalid color string", () => {
      expect(() => toColor("not-a-color")).toThrow("Invalid color");
    });
  });

  describe("lightenColor", () => {
    it("should lighten a color", () => {
      const result = lightenColor("#800000", 1.5);
      expect(result).toBeDefined();
    });

    it("should work with W3C color", () => {
      const w3c: W3CColorValue = { colorSpace: "srgb", components: [0.5, 0, 0] };
      const result = lightenColor(w3c, 1.5);
      expect(result).toBeDefined();
    });
  });

  describe("darkenColor", () => {
    it("should darken a color", () => {
      const result = darkenColor("#ff0000", 0.5);
      expect(result).toBeDefined();
    });
  });

  describe("saturateColor", () => {
    it("should saturate a color", () => {
      const result = saturateColor("#804040", 2);
      expect(result).toBeDefined();
    });
  });

  describe("desaturateColor", () => {
    it("should desaturate a color", () => {
      const result = desaturateColor("#ff0000", 0.5);
      expect(result).toBeDefined();
    });
  });

  describe("opacifyColor", () => {
    it("should adjust alpha", () => {
      const result = opacifyColor("#ff0000", 0.5);
      expect(result).toBeDefined();
    });

    it("should handle percentage values", () => {
      const result = opacifyColor("#ff0000", 50);
      expect(result).toBeDefined();
    });
  });

  describe("contrastColor", () => {
    it("should adjust contrast", () => {
      const result = contrastColor("#808080", 1.5);
      expect(result).toBeDefined();
    });
  });

  describe("hueRotateColor", () => {
    it("should rotate hue", () => {
      const result = hueRotateColor("#ff0000", 120);
      expect(result).toBeDefined();
    });
  });

  describe("invertColor", () => {
    it("should invert a color", () => {
      const result = invertColor("#ff0000", 1);
      expect(result).toBeDefined();
    });

    it("should partially invert", () => {
      const result = invertColor("#ff0000", 0.5);
      expect(result).toBeDefined();
    });
  });

  describe("grayscaleColor", () => {
    it("should convert to grayscale", () => {
      const result = grayscaleColor("#ff0000", 1);
      expect(result).toBeDefined();
    });

    it("should partially grayscale", () => {
      const result = grayscaleColor("#ff0000", 0.5);
      expect(result).toBeDefined();
    });
  });

  describe("sepiaColor", () => {
    it("should apply sepia filter", () => {
      const result = sepiaColor("#808080", 1);
      expect(result).toBeDefined();
    });
  });

  describe("parseModifierValue", () => {
    it("should parse number", () => {
      expect(parseModifierValue(1.5)).toBe(1.5);
    });

    it("should parse string number", () => {
      expect(parseModifierValue("1.5")).toBe(1.5);
    });

    it("should parse object with value property", () => {
      expect(parseModifierValue({ value: 1.5 })).toBe(1.5);
    });

    it("should throw for invalid string", () => {
      expect(() => parseModifierValue("abc")).toThrow("Invalid number value");
    });

    it("should throw for null", () => {
      expect(() => parseModifierValue(null)).toThrow("Invalid number value");
    });
  });

  describe("applyColorModifier", () => {
    it("should apply alpha modifier", () => {
      const result = applyColorModifier("#ff0000", { type: "alpha", value: 0.5 });
      expect(result).toBeDefined();
    });

    it("should apply lighten modifier", () => {
      const result = applyColorModifier("#800000", { type: "lighten", value: 1.5 });
      expect(result).toBeDefined();
    });

    it("should apply darken modifier", () => {
      const result = applyColorModifier("#ff0000", { type: "darken", value: 0.5 });
      expect(result).toBeDefined();
    });

    it("should apply saturate modifier", () => {
      const result = applyColorModifier("#804040", { type: "saturate", value: 2 });
      expect(result).toBeDefined();
    });

    it("should apply desaturate modifier", () => {
      const result = applyColorModifier("#ff0000", { type: "desaturate", value: 0.5 });
      expect(result).toBeDefined();
    });

    it("should apply contrast modifier", () => {
      const result = applyColorModifier("#808080", { type: "contrast", value: 1.5 });
      expect(result).toBeDefined();
    });

    it("should apply hue-rotate modifier", () => {
      const result = applyColorModifier("#ff0000", { type: "hue-rotate", value: 120 });
      expect(result).toBeDefined();
    });

    it("should apply invert modifier", () => {
      const result = applyColorModifier("#ff0000", { type: "invert", value: 1 });
      expect(result).toBeDefined();
    });

    it("should apply grayscale modifier", () => {
      const result = applyColorModifier("#ff0000", { type: "grayscale", value: 1 });
      expect(result).toBeDefined();
    });

    it("should apply sepia modifier", () => {
      const result = applyColorModifier("#808080", { type: "sepia", value: 1 });
      expect(result).toBeDefined();
    });

    it("should throw for invalid modifier type", () => {
      expect(() => applyColorModifier("#ff0000", { type: "invalid" as any, value: 1 })).toThrow(
        "Invalid modifier type"
      );
    });
  });

  describe("applyColorModifiers", () => {
    it("should return color unchanged if no modifiers", () => {
      const result = applyColorModifiers("#ff0000");
      expect(result).toBeDefined();
    });

    it("should apply single modifier", () => {
      const result = applyColorModifiers("#ff0000", { type: "alpha", value: 0.5 });
      expect(result).toBeDefined();
    });

    it("should apply multiple modifiers in order", () => {
      const result = applyColorModifiers("#ff0000", [
        { type: "lighten", value: 1.2 },
        { type: "alpha", value: 0.8 },
      ]);
      expect(result).toBeDefined();
    });
  });

  describe("formatColor", () => {
    it("should format to hex", () => {
      const hex = formatColor("#ff0000");
      expect(hex).toBe("#ff0000");
    });

    it("should format with alpha to hex8", () => {
      const color = { mode: "rgb", r: 1, g: 0, b: 0, alpha: 0.5 } as const;
      const hex = formatColor(color);
      expect(hex).toMatch(/^#[0-9a-f]{8}$/);
    });

    it("should format W3C color", () => {
      const w3c: W3CColorValue = { colorSpace: "srgb", components: [1, 0, 0] };
      const hex = formatColor(w3c);
      expect(hex).toBe("#ff0000");
    });
  });

  describe("applyModifiersToW3CColor", () => {
    it("should return unchanged if no modifiers", () => {
      const w3c: W3CColorValue = { colorSpace: "srgb", components: [1, 0, 0] };
      const result = applyModifiersToW3CColor(w3c);
      expect(result).toEqual(w3c);
    });

    it("should apply modifiers and return W3C color", () => {
      const w3c: W3CColorValue = { colorSpace: "srgb", components: [1, 0, 0] };
      const result = applyModifiersToW3CColor(w3c, { type: "lighten", value: 1.2 });
      expect(result.colorSpace).toBe("srgb");
      expect(result.components).toBeDefined();
    });
  });

  describe("mixColors", () => {
    it("should mix two colors equally", () => {
      const result = mixColors("#ff0000", "#0000ff", 0.5);
      expect(result).toBeDefined();
      expect(result.mode).toBe("rgb");
    });

    it("should favor first color with low weight", () => {
      const result = mixColors("#ff0000", "#0000ff", 0.1);
      expect(result).toBeDefined();
    });

    it("should favor second color with high weight", () => {
      const result = mixColors("#ff0000", "#0000ff", 0.9);
      expect(result).toBeDefined();
    });

    it("should default to 0.5 weight", () => {
      const result = mixColors("#ff0000", "#0000ff");
      expect(result).toBeDefined();
    });

    it("should mix W3C colors", () => {
      const w3c1: W3CColorValue = { colorSpace: "srgb", components: [1, 0, 0] };
      const w3c2: W3CColorValue = { colorSpace: "srgb", components: [0, 0, 1] };
      const result = mixColors(w3c1, w3c2, 0.5);
      expect(result).toBeDefined();
    });
  });

  describe("getLuminance", () => {
    it("should return 0 for black", () => {
      const luminance = getLuminance("#000000");
      expect(luminance).toBeCloseTo(0, 5);
    });

    it("should return 1 for white", () => {
      const luminance = getLuminance("#ffffff");
      expect(luminance).toBeCloseTo(1, 5);
    });

    it("should return intermediate value for gray", () => {
      const luminance = getLuminance("#808080");
      expect(luminance).toBeGreaterThan(0);
      expect(luminance).toBeLessThan(1);
    });
  });

  describe("getContrastRatio", () => {
    it("should return 21:1 for black on white", () => {
      const ratio = getContrastRatio("#000000", "#ffffff");
      expect(ratio).toBeCloseTo(21, 0);
    });

    it("should return 1:1 for same colors", () => {
      const ratio = getContrastRatio("#ff0000", "#ff0000");
      expect(ratio).toBeCloseTo(1, 5);
    });

    it("should be symmetric", () => {
      const ratio1 = getContrastRatio("#ff0000", "#0000ff");
      const ratio2 = getContrastRatio("#0000ff", "#ff0000");
      expect(ratio1).toBeCloseTo(ratio2, 5);
    });
  });

  describe("meetsContrastRequirement", () => {
    it("should pass AA for black on white", () => {
      expect(meetsContrastRequirement("#000000", "#ffffff", "AA")).toBe(true);
    });

    it("should pass AAA for black on white", () => {
      expect(meetsContrastRequirement("#000000", "#ffffff", "AAA")).toBe(true);
    });

    it("should fail AA for low contrast colors", () => {
      expect(meetsContrastRequirement("#777777", "#888888", "AA")).toBe(false);
    });

    it("should use lower threshold for large text", () => {
      const fg = "#666666";
      const bg = "#ffffff";
      // May pass for large text but fail for normal text
      const largeResult = meetsContrastRequirement(fg, bg, "AA", true);
      const normalResult = meetsContrastRequirement(fg, bg, "AA", false);
      // Large text has lower threshold, so if normal passes, large must too
      if (normalResult) {
        expect(largeResult).toBe(true);
      }
    });

    it("should default to AA level", () => {
      const result = meetsContrastRequirement("#000000", "#ffffff");
      expect(result).toBe(true);
    });
  });
});
