/**
 * CSS Utilities Tests
 *
 * Tests for CSS value generation functions.
 */
import { describe, expect, it } from "bun:test";
import {
  pathToCssVarName,
  processCssVarRef,
  normalizeTokenPath,
  valueToCSSString,
  pathToStyleName,
  colorToCssValue,
  borderToCssValue,
  borderToCssStyle,
  shadowToCssValue,
  strokeStyleToCssValue,
  cubicBezierToCssValue,
  transitionToCssValue,
  transitionToCssStyle,
  fontFamilyToCssValue,
  fontWeightToCssValue,
  typographyToCssStyle,
  gradientToCssValue,
  tokenValueToCss,
  tokenToCss,
} from "../src/css";
import type { W3CColorValue, W3CDimensionValue, W3CDurationValue } from "../src/types/w3c";

describe("CSS Utilities", () => {
  describe("pathToCssVarName", () => {
    it("should convert path to CSS variable name", () => {
      expect(pathToCssVarName("colors.primary")).toBe("--colors-primary");
    });

    it("should add prefix", () => {
      expect(pathToCssVarName("colors.primary", "ds-")).toBe("--ds-colors-primary");
    });

    it("should escape @ symbol", () => {
      expect(pathToCssVarName("colors.primary@dark")).toBe("--colors-primary\\@dark");
    });
  });

  describe("processCssVarRef", () => {
    it("should process alias to CSS var", () => {
      const result = processCssVarRef("{colors.primary}");
      expect(result).toBe("var(--colors-primary)");
    });

    it("should add prefix", () => {
      const result = processCssVarRef("{colors.primary}", "ds-");
      expect(result).toBe("var(--ds-colors-primary)");
    });

    it("should add default value", () => {
      const result = processCssVarRef("{colors.primary}", undefined, "#ff0000");
      expect(result).toBe("var(--colors-primary, #ff0000)");
    });
  });

  describe("normalizeTokenPath", () => {
    it("should normalize alias to path", () => {
      expect(normalizeTokenPath("{colors.primary}")).toBe("colors.primary");
    });

    it("should pass through regular path", () => {
      expect(normalizeTokenPath("colors.primary")).toBe("colors.primary");
    });

    it("should remove invalid characters", () => {
      expect(normalizeTokenPath("colors.primary!@#")).toBe("colors.primary");
    });
  });

  describe("valueToCSSString", () => {
    it("should convert W3C color to CSS", () => {
      const w3c: W3CColorValue = { colorSpace: "srgb", components: [1, 0, 0] };
      const result = valueToCSSString(w3c);
      expect(typeof result).toBe("string");
    });

    it("should convert W3C dimension to CSS", () => {
      const w3c: W3CDimensionValue = { value: 16, unit: "px" };
      expect(valueToCSSString(w3c)).toBe("16px");
    });

    it("should convert W3C duration to CSS", () => {
      const w3c: W3CDurationValue = { value: 200, unit: "ms" };
      expect(valueToCSSString(w3c)).toBe("200ms");
    });

    it("should convert token alias", () => {
      expect(valueToCSSString("{colors.primary}")).toBe("colors.primary");
    });

    it("should convert $ref", () => {
      expect(valueToCSSString({ $ref: "#/colors/primary" })).toBe("colors.primary");
    });

    it("should convert primitive values", () => {
      expect(valueToCSSString("16px")).toBe("16px");
      expect(valueToCSSString(16)).toBe("16");
    });
  });

  describe("pathToStyleName", () => {
    it("should convert path to camelCase style name", () => {
      expect(pathToStyleName("colors.primary.500")).toBe("colorsPrimary500");
    });

    it("should use last N parts", () => {
      expect(pathToStyleName("brand.colors.primary.500", { count: 2 })).toBe("primary500");
    });
  });

  describe("colorToCssValue", () => {
    it("should convert hex color", () => {
      expect(colorToCssValue("#ff0000")).toBe("#ff0000");
    });

    it("should convert W3C color", () => {
      const w3c: W3CColorValue = { colorSpace: "srgb", components: [1, 0, 0] };
      const result = colorToCssValue(w3c);
      expect(typeof result).toBe("string");
    });

    it("should return empty for undefined", () => {
      expect(colorToCssValue(undefined)).toBe("");
    });
  });

  describe("borderToCssStyle", () => {
    it("should return border style object", () => {
      const border = { color: "#000000", width: "1px", style: "solid" };
      const result = borderToCssStyle(border);
      expect((result as any).borderColor).toBe("#000000");
      expect((result as any).borderWidth).toBe("1px");
      expect((result as any).borderStyle).toBe("solid");
    });

    it("should pass through alias", () => {
      expect(borderToCssStyle("{borders.default}" as any)).toBe("{borders.default}");
    });
  });

  describe("borderToCssValue", () => {
    it("should convert border to CSS shorthand", () => {
      const border = { color: "#000000", width: "1px", style: "solid" };
      const result = borderToCssValue(border);
      expect(result).toBe("1px solid #000000");
    });
  });

  describe("shadowToCssValue", () => {
    it("should convert shadow to CSS value", () => {
      const shadow = {
        offsetX: "0px",
        offsetY: "2px",
        blur: "4px",
        spread: "0px",
        color: "#000000",
      };
      const result = shadowToCssValue(shadow);
      expect(result).toContain("0px 2px 4px 0px #000000");
    });

    it("should handle shadow array", () => {
      const shadows = [
        { offsetX: "0px", offsetY: "2px", blur: "4px", spread: "0px", color: "#000000" },
        { offsetX: "0px", offsetY: "4px", blur: "8px", spread: "0px", color: "#333333" },
      ];
      const result = shadowToCssValue(shadows);
      expect(result).toContain(", ");
    });
  });

  describe("strokeStyleToCssValue", () => {
    it("should return string stroke styles", () => {
      expect(strokeStyleToCssValue("solid")).toBe("solid");
      expect(strokeStyleToCssValue("dashed")).toBe("dashed");
    });

    it("should return 'dashed' for object stroke style", () => {
      const stroke = { dashArray: ["10px", "5px"], lineCap: "round" };
      expect(strokeStyleToCssValue(stroke as any)).toBe("dashed");
    });
  });

  describe("cubicBezierToCssValue", () => {
    it("should convert to CSS cubic-bezier", () => {
      expect(cubicBezierToCssValue([0, 0, 1, 1])).toBe("cubic-bezier(0, 0, 1, 1)");
    });

    it("should pass through alias", () => {
      expect(cubicBezierToCssValue("{easing.ease}" as any)).toBe("{easing.ease}");
    });
  });

  describe("transitionToCssStyle", () => {
    it("should return transition style object", () => {
      const transition = {
        duration: "200ms",
        timingFunction: [0, 0, 1, 1],
        delay: "100ms",
      };
      const result = transitionToCssStyle(transition);
      expect((result as any).transitionDuration).toBe("200ms");
      expect((result as any).transitionDelay).toBe("100ms");
      // [0, 0, 1, 1] is "linear" in CSS easing keywords
      expect((result as any).transitionTimingFunction).toBe("linear");
    });
  });

  describe("transitionToCssValue", () => {
    it("should convert transition to CSS shorthand", () => {
      const transition = {
        duration: "200ms",
        timingFunction: [0.4, 0, 0.2, 1], // Custom bezier (not a keyword)
        delay: "100ms",
      };
      const result = transitionToCssValue(transition);
      expect(result).toContain("200ms");
      expect(result).toContain("100ms");
      expect(result).toContain("cubic-bezier");
    });
  });

  describe("fontFamilyToCssValue", () => {
    it("should join array with commas", () => {
      expect(fontFamilyToCssValue(["Arial", "Helvetica", "sans-serif"])).toBe(
        "Arial, Helvetica, sans-serif"
      );
    });

    it("should normalize string to array and join", () => {
      const result = fontFamilyToCssValue("Arial");
      expect(result).toBe("Arial");
    });

    it("should pass through alias", () => {
      expect(fontFamilyToCssValue("{fonts.body}" as any)).toBe("{fonts.body}");
    });
  });

  describe("fontWeightToCssValue", () => {
    it("should return number weight", () => {
      expect(fontWeightToCssValue(400)).toBe(400);
    });

    it("should convert named weight to number", () => {
      expect(fontWeightToCssValue("bold")).toBe(700);
    });
  });

  describe("typographyToCssStyle", () => {
    it("should return typography style object", () => {
      const typography = {
        fontFamily: ["Arial", "sans-serif"],
        fontSize: "16px",
        fontWeight: 400,
      };
      const result = typographyToCssStyle(typography);
      expect((result as any).fontFamily).toBe("Arial, sans-serif");
      expect((result as any).fontSize).toBe("16px");
      expect((result as any).fontWeight).toBe(400);
    });
  });

  describe("gradientToCssValue", () => {
    it("should convert gradient to CSS value", () => {
      const gradient = [
        { color: "#ff0000", position: 0 },
        { color: "#0000ff", position: 1 },
      ];
      const result = gradientToCssValue(gradient);
      expect(result).toContain("#ff0000 0%");
      expect(result).toContain("#0000ff 100%");
    });

    it("should pass through alias", () => {
      expect(gradientToCssValue("{gradients.primary}" as any)).toBe("{gradients.primary}");
    });
  });

  describe("tokenValueToCss", () => {
    it("should handle color type", () => {
      const result = tokenValueToCss("#ff0000", "color");
      expect(result).toBe("#ff0000");
    });

    it("should handle dimension type", () => {
      const result = tokenValueToCss("16px", "dimension");
      expect(result).toBe("16px");
    });

    it("should handle duration type", () => {
      const result = tokenValueToCss("200ms", "duration");
      expect(result).toBe("200ms");
    });

    it("should handle number type", () => {
      const result = tokenValueToCss(1.5, "number");
      expect(result).toBe("1.5");
    });

    it("should return empty for unknown type", () => {
      expect(tokenValueToCss("value", "unknown" as any)).toBe("");
    });
  });

  describe("tokenToCss", () => {
    it("should convert complete token to CSS", () => {
      const token = { $type: "color" as const, $value: "#ff0000" };
      expect(tokenToCss(token)).toBe("#ff0000");
    });

    it("should handle dimension token", () => {
      const token = { $type: "dimension" as const, $value: "16px" };
      expect(tokenToCss(token)).toBe("16px");
    });
  });
});
