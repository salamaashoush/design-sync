/**
 * Validators Tests
 *
 * Tests for W3C-compliant token value validators.
 */
import { describe, expect, it } from "bun:test";
import {
  validateTokenName,
  validateColorValue,
  validateDimensionValue,
  validateDurationValue,
  validateCubicBezierValue,
  validateFontFamilyValue,
  validateFontWeightValue,
  validateStrokeStyleValue,
  validateShadowValue,
  validateBorderValue,
  validateTransitionValue,
  validateGradientValue,
  validateTypographyValue,
  validateReference,
  validateDeprecated,
  isReference,
  VALID_COLOR_SPACES,
  VALID_STROKE_STYLES,
  VALID_FONT_WEIGHT_NAMES,
} from "../../src/validation/validators";
import { ValidationErrorCode } from "../../src/validation/errors";

describe("Validators", () => {
  describe("validateTokenName", () => {
    it("should return no errors for valid token names", () => {
      expect(validateTokenName("valid-name", "path")).toHaveLength(0);
      expect(validateTokenName("validName", "path")).toHaveLength(0);
      expect(validateTokenName("valid_name", "path")).toHaveLength(0);
    });

    it("should return error for names starting with $", () => {
      const errors = validateTokenName("$invalid", "path");
      expect(errors).toHaveLength(1);
      expect(errors[0].code).toBe(ValidationErrorCode.INVALID_TOKEN_NAME_START);
    });

    it("should return error for names containing {", () => {
      const errors = validateTokenName("invalid{name", "path");
      expect(errors).toHaveLength(1);
      expect(errors[0].code).toBe(ValidationErrorCode.INVALID_TOKEN_NAME_CHAR);
    });

    it("should return error for names containing }", () => {
      const errors = validateTokenName("invalid}name", "path");
      expect(errors).toHaveLength(1);
    });

    it("should return error for names containing .", () => {
      const errors = validateTokenName("invalid.name", "path");
      expect(errors).toHaveLength(1);
    });

    it("should return multiple errors for multiple violations", () => {
      const errors = validateTokenName("${invalid}", "path");
      expect(errors.length).toBeGreaterThan(1);
    });
  });

  describe("validateColorValue", () => {
    it("should accept W3C color object", () => {
      const errors = validateColorValue(
        { colorSpace: "srgb", components: [1, 0, 0] },
        "path"
      );
      expect(errors).toHaveLength(0);
    });

    it("should accept W3C color with alpha", () => {
      const errors = validateColorValue(
        { colorSpace: "srgb", components: [1, 0, 0], alpha: 0.5 },
        "path"
      );
      expect(errors).toHaveLength(0);
    });

    it("should accept W3C color with none components", () => {
      const errors = validateColorValue(
        { colorSpace: "hsl", components: ["none", 0.5, 0.5] },
        "path"
      );
      expect(errors).toHaveLength(0);
    });

    it("should accept legacy hex color by default", () => {
      const errors = validateColorValue("#ff0000", "path");
      expect(errors).toHaveLength(0);
    });

    it("should reject legacy color when allowLegacy is false", () => {
      const errors = validateColorValue("#ff0000", "path", { allowLegacy: false });
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should reject invalid color space", () => {
      const errors = validateColorValue(
        { colorSpace: "invalid", components: [1, 0, 0] },
        "path"
      );
      expect(errors.some((e) => e.code === ValidationErrorCode.INVALID_COLOR_SPACE)).toBe(true);
    });

    it("should reject wrong components length", () => {
      const errors = validateColorValue(
        { colorSpace: "srgb", components: [1, 0] },
        "path"
      );
      // isW3CColorValue returns false for wrong components length, so it's treated as invalid color
      expect(errors.some((e) => e.code === ValidationErrorCode.INVALID_COLOR_VALUE)).toBe(true);
    });

    it("should reject non-number/none components", () => {
      const errors = validateColorValue(
        { colorSpace: "srgb", components: [1, "invalid", 0] },
        "path"
      );
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should accept token references", () => {
      const errors = validateColorValue("{colors.primary}", "path");
      expect(errors).toHaveLength(0);
    });

    it("should accept $ref references", () => {
      const errors = validateColorValue({ $ref: "#/colors/primary" }, "path");
      expect(errors).toHaveLength(0);
    });
  });

  describe("validateDimensionValue", () => {
    it("should accept W3C dimension object with px", () => {
      const errors = validateDimensionValue({ value: 16, unit: "px" }, "path");
      expect(errors).toHaveLength(0);
    });

    it("should accept W3C dimension object with rem", () => {
      const errors = validateDimensionValue({ value: 1.5, unit: "rem" }, "path");
      expect(errors).toHaveLength(0);
    });

    it("should accept legacy dimension by default", () => {
      const errors = validateDimensionValue("16px", "path");
      expect(errors).toHaveLength(0);
    });

    it("should reject legacy when allowLegacy is false", () => {
      const errors = validateDimensionValue("16px", "path", { allowLegacy: false });
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should reject invalid unit", () => {
      const errors = validateDimensionValue({ value: 16, unit: "em" }, "path");
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should reject non-number value", () => {
      const errors = validateDimensionValue({ value: "16", unit: "px" }, "path");
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should accept token references", () => {
      const errors = validateDimensionValue("{spacing.md}", "path");
      expect(errors).toHaveLength(0);
    });
  });

  describe("validateDurationValue", () => {
    it("should accept W3C duration object with ms", () => {
      const errors = validateDurationValue({ value: 500, unit: "ms" }, "path");
      expect(errors).toHaveLength(0);
    });

    it("should accept W3C duration object with s", () => {
      const errors = validateDurationValue({ value: 0.5, unit: "s" }, "path");
      expect(errors).toHaveLength(0);
    });

    it("should accept legacy duration by default", () => {
      const errors = validateDurationValue("500ms", "path");
      expect(errors).toHaveLength(0);
    });

    it("should reject legacy when allowLegacy is false", () => {
      const errors = validateDurationValue("500ms", "path", { allowLegacy: false });
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should reject invalid unit", () => {
      const errors = validateDurationValue({ value: 500, unit: "min" }, "path");
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("validateCubicBezierValue", () => {
    it("should accept valid cubic bezier array", () => {
      const errors = validateCubicBezierValue([0.4, 0, 0.2, 1], "path");
      expect(errors).toHaveLength(0);
    });

    it("should reject non-array", () => {
      const errors = validateCubicBezierValue("ease-in", "path");
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should reject wrong array length", () => {
      const errors = validateCubicBezierValue([0.4, 0, 0.2], "path");
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should reject non-number values", () => {
      const errors = validateCubicBezierValue([0.4, "0", 0.2, 1], "path");
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should warn for out-of-range X values", () => {
      const errors = validateCubicBezierValue([1.5, 0, 0.2, 1], "path");
      expect(errors.some((e) => e.severity === "warning")).toBe(true);
    });

    it("should accept token references", () => {
      const errors = validateCubicBezierValue("{animation.easing}", "path");
      expect(errors).toHaveLength(0);
    });
  });

  describe("validateFontFamilyValue", () => {
    it("should accept string font family", () => {
      const errors = validateFontFamilyValue("Arial", "path");
      expect(errors).toHaveLength(0);
    });

    it("should accept array of font families", () => {
      const errors = validateFontFamilyValue(["Arial", "sans-serif"], "path");
      expect(errors).toHaveLength(0);
    });

    it("should reject empty string", () => {
      const errors = validateFontFamilyValue("", "path");
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should reject empty array", () => {
      const errors = validateFontFamilyValue([], "path");
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should reject array with non-strings", () => {
      const errors = validateFontFamilyValue(["Arial", 123], "path");
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("validateFontWeightValue", () => {
    it("should accept numeric weight", () => {
      const errors = validateFontWeightValue(400, "path");
      expect(errors).toHaveLength(0);
    });

    it("should accept named weight", () => {
      const errors = validateFontWeightValue("bold", "path");
      expect(errors).toHaveLength(0);
    });

    it("should accept string numeric weight", () => {
      const errors = validateFontWeightValue("700", "path");
      expect(errors).toHaveLength(0);
    });

    it("should reject weight < 1", () => {
      const errors = validateFontWeightValue(0, "path");
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should reject weight > 1000", () => {
      const errors = validateFontWeightValue(1001, "path");
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should reject invalid weight name", () => {
      const errors = validateFontWeightValue("invalid", "path");
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should accept all valid weight names", () => {
      for (const name of VALID_FONT_WEIGHT_NAMES) {
        const errors = validateFontWeightValue(name, "path");
        expect(errors).toHaveLength(0);
      }
    });
  });

  describe("validateStrokeStyleValue", () => {
    it("should accept valid stroke style names", () => {
      for (const style of VALID_STROKE_STYLES) {
        const errors = validateStrokeStyleValue(style, "path");
        expect(errors).toHaveLength(0);
      }
    });

    it("should accept stroke style object", () => {
      const errors = validateStrokeStyleValue(
        { dashArray: [{ value: 2, unit: "px" }], lineCap: "round" },
        "path"
      );
      expect(errors).toHaveLength(0);
    });

    it("should reject invalid stroke style name", () => {
      const errors = validateStrokeStyleValue("invalid", "path");
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should reject invalid lineCap", () => {
      const errors = validateStrokeStyleValue(
        { dashArray: [{ value: 2, unit: "px" }], lineCap: "invalid" },
        "path"
      );
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("validateShadowValue", () => {
    it("should accept valid shadow object", () => {
      const errors = validateShadowValue(
        {
          color: { colorSpace: "srgb", components: [0, 0, 0] },
          offsetX: { value: 0, unit: "px" },
          offsetY: { value: 4, unit: "px" },
          blur: { value: 8, unit: "px" },
          spread: { value: 0, unit: "px" },
        },
        "path"
      );
      expect(errors).toHaveLength(0);
    });

    it("should accept array of shadows", () => {
      const errors = validateShadowValue(
        [
          {
            color: "#000",
            offsetX: "0px",
            offsetY: "4px",
            blur: "8px",
            spread: "0px",
          },
        ],
        "path"
      );
      expect(errors).toHaveLength(0);
    });

    it("should reject shadow without color", () => {
      const errors = validateShadowValue(
        {
          offsetX: { value: 0, unit: "px" },
          offsetY: { value: 4, unit: "px" },
          blur: { value: 8, unit: "px" },
          spread: { value: 0, unit: "px" },
        },
        "path"
      );
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should reject non-object shadow", () => {
      const errors = validateShadowValue("0 4px 8px black", "path");
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("validateBorderValue", () => {
    it("should accept valid border object", () => {
      const errors = validateBorderValue(
        {
          width: { value: 1, unit: "px" },
          style: "solid",
          color: { colorSpace: "srgb", components: [0, 0, 0] },
        },
        "path"
      );
      expect(errors).toHaveLength(0);
    });

    it("should reject border without width", () => {
      const errors = validateBorderValue(
        {
          style: "solid",
          color: "#000",
        },
        "path"
      );
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should reject border without style", () => {
      const errors = validateBorderValue(
        {
          width: "1px",
          color: "#000",
        },
        "path"
      );
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should reject border without color", () => {
      const errors = validateBorderValue(
        {
          width: "1px",
          style: "solid",
        },
        "path"
      );
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("validateTransitionValue", () => {
    it("should accept valid transition object", () => {
      const errors = validateTransitionValue(
        {
          duration: { value: 300, unit: "ms" },
          delay: { value: 0, unit: "ms" },
          timingFunction: [0.4, 0, 0.2, 1],
        },
        "path"
      );
      expect(errors).toHaveLength(0);
    });

    it("should reject transition without duration", () => {
      const errors = validateTransitionValue(
        {
          timingFunction: [0.4, 0, 0.2, 1],
        },
        "path"
      );
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should reject transition without timingFunction", () => {
      const errors = validateTransitionValue(
        {
          duration: "300ms",
        },
        "path"
      );
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("validateGradientValue", () => {
    it("should accept valid gradient array", () => {
      const errors = validateGradientValue(
        [
          { color: "#ff0000", position: 0 },
          { color: "#0000ff", position: 1 },
        ],
        "path"
      );
      expect(errors).toHaveLength(0);
    });

    it("should reject non-array", () => {
      const errors = validateGradientValue({ from: "#ff0000", to: "#0000ff" }, "path");
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should reject stop without color", () => {
      const errors = validateGradientValue([{ position: 0 }], "path");
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should reject stop without position", () => {
      const errors = validateGradientValue([{ color: "#ff0000" }], "path");
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("validateTypographyValue", () => {
    it("should accept valid typography object", () => {
      const errors = validateTypographyValue(
        {
          fontFamily: "Arial",
          fontSize: { value: 16, unit: "px" },
          fontWeight: 400,
          lineHeight: 1.5,
          letterSpacing: { value: 0, unit: "px" },
        },
        "path"
      );
      expect(errors).toHaveLength(0);
    });

    it("should reject non-object", () => {
      const errors = validateTypographyValue("16px Arial", "path");
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should validate nested properties", () => {
      const errors = validateTypographyValue(
        {
          fontFamily: "", // invalid empty
          fontSize: "invalid", // invalid
        },
        "path"
      );
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("validateReference", () => {
    it("should accept valid curly brace alias", () => {
      const errors = validateReference("{colors.primary}", "path");
      expect(errors).toHaveLength(0);
    });

    it("should accept valid $ref", () => {
      const errors = validateReference({ $ref: "#/colors/primary" }, "path");
      expect(errors).toHaveLength(0);
    });

    it("should reject $ref not starting with #/", () => {
      const errors = validateReference({ $ref: "colors/primary" }, "path");
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should reject invalid reference format", () => {
      const errors = validateReference("colors.primary", "path");
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("validateDeprecated", () => {
    it("should accept boolean", () => {
      expect(validateDeprecated(true, "path")).toHaveLength(0);
      expect(validateDeprecated(false, "path")).toHaveLength(0);
    });

    it("should accept string", () => {
      const errors = validateDeprecated("Use newToken instead", "path");
      expect(errors).toHaveLength(0);
    });

    it("should accept undefined", () => {
      const errors = validateDeprecated(undefined, "path");
      expect(errors).toHaveLength(0);
    });

    it("should reject number", () => {
      const errors = validateDeprecated(1, "path");
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should reject object", () => {
      const errors = validateDeprecated({ reason: "old" }, "path");
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("isReference", () => {
    it("should return true for curly brace alias", () => {
      expect(isReference("{colors.primary}")).toBe(true);
    });

    it("should return true for $ref", () => {
      expect(isReference({ $ref: "#/colors/primary" })).toBe(true);
    });

    it("should return false for regular string", () => {
      expect(isReference("#ff0000")).toBe(false);
    });

    it("should return false for regular object", () => {
      expect(isReference({ colorSpace: "srgb", components: [1, 0, 0] })).toBe(false);
    });
  });

  describe("Constants", () => {
    it("should have all 14 valid color spaces", () => {
      expect(VALID_COLOR_SPACES).toHaveLength(14);
      expect(VALID_COLOR_SPACES).toContain("srgb");
      expect(VALID_COLOR_SPACES).toContain("oklch");
    });

    it("should have all valid stroke styles", () => {
      expect(VALID_STROKE_STYLES).toContain("solid");
      expect(VALID_STROKE_STYLES).toContain("dashed");
      expect(VALID_STROKE_STYLES).toContain("dotted");
    });

    it("should have all valid font weight names", () => {
      expect(VALID_FONT_WEIGHT_NAMES).toContain("thin");
      expect(VALID_FONT_WEIGHT_NAMES).toContain("normal");
      expect(VALID_FONT_WEIGHT_NAMES).toContain("bold");
      expect(VALID_FONT_WEIGHT_NAMES).toContain("black");
    });
  });
});
