/**
 * W3C Types Tests
 *
 * Tests for W3C-compliant type definitions and type guards.
 */
import { describe, expect, it } from "bun:test";
import {
  isValidW3CTokenName,
  isW3CColorValue,
  isW3CDimensionValue,
  isW3CDurationValue,
  isW3CTokenRef,
  isW3CStrokeStyleObject,
  W3C_INVALID_TOKEN_NAME_START,
  W3C_INVALID_TOKEN_NAME_CHARS,
  type W3CColorValue,
  type W3CDimensionValue,
  type W3CDurationValue,
  type W3CTokenRef,
  type W3CColorSpace,
} from "../../src/types/w3c";

describe("W3C Types", () => {
  describe("Token Name Validation", () => {
    it("should reject names starting with $", () => {
      expect(isValidW3CTokenName("$invalid")).toBe(false);
      expect(isValidW3CTokenName("$type")).toBe(false);
      expect(isValidW3CTokenName("$value")).toBe(false);
    });

    it("should reject names containing {", () => {
      expect(isValidW3CTokenName("invalid{name")).toBe(false);
      expect(isValidW3CTokenName("{name}")).toBe(false);
    });

    it("should reject names containing }", () => {
      expect(isValidW3CTokenName("invalid}name")).toBe(false);
    });

    it("should reject names containing .", () => {
      expect(isValidW3CTokenName("invalid.name")).toBe(false);
      expect(isValidW3CTokenName("path.to.token")).toBe(false);
    });

    it("should accept valid token names", () => {
      expect(isValidW3CTokenName("valid-name")).toBe(true);
      expect(isValidW3CTokenName("validName")).toBe(true);
      expect(isValidW3CTokenName("valid_name")).toBe(true);
      expect(isValidW3CTokenName("valid123")).toBe(true);
      expect(isValidW3CTokenName("primary")).toBe(true);
      expect(isValidW3CTokenName("color-primary-500")).toBe(true);
    });

    it("should have correct invalid start character", () => {
      expect(W3C_INVALID_TOKEN_NAME_START).toBe("$");
    });

    it("should have correct invalid characters", () => {
      expect(W3C_INVALID_TOKEN_NAME_CHARS).toEqual(["{", "}", "."]);
    });
  });

  describe("isW3CColorValue", () => {
    it("should return true for valid W3C color objects", () => {
      const validColor: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
      };
      expect(isW3CColorValue(validColor)).toBe(true);
    });

    it("should return true for color with alpha", () => {
      const colorWithAlpha: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
        alpha: 0.5,
      };
      expect(isW3CColorValue(colorWithAlpha)).toBe(true);
    });

    it("should return true for color with hex", () => {
      const colorWithHex: W3CColorValue = {
        colorSpace: "srgb",
        components: [1, 0, 0],
        hex: "#ff0000",
      };
      expect(isW3CColorValue(colorWithHex)).toBe(true);
    });

    it("should return true for all 14 color spaces", () => {
      const colorSpaces: W3CColorSpace[] = [
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

      for (const colorSpace of colorSpaces) {
        const color: W3CColorValue = {
          colorSpace,
          components: [0.5, 0.5, 0.5],
        };
        expect(isW3CColorValue(color)).toBe(true);
      }
    });

    it("should return true for color with none components", () => {
      const colorWithNone: W3CColorValue = {
        colorSpace: "hsl",
        components: ["none", 0.5, 0.5],
      };
      expect(isW3CColorValue(colorWithNone)).toBe(true);
    });

    it("should return false for null", () => {
      expect(isW3CColorValue(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isW3CColorValue(undefined)).toBe(false);
    });

    it("should return false for string", () => {
      expect(isW3CColorValue("#ff0000")).toBe(false);
    });

    it("should return false for missing colorSpace", () => {
      expect(isW3CColorValue({ components: [1, 0, 0] })).toBe(false);
    });

    it("should return false for missing components", () => {
      expect(isW3CColorValue({ colorSpace: "srgb" })).toBe(false);
    });

    it("should return false for wrong components length", () => {
      expect(isW3CColorValue({ colorSpace: "srgb", components: [1, 0] })).toBe(false);
      expect(isW3CColorValue({ colorSpace: "srgb", components: [1, 0, 0, 1] })).toBe(false);
    });
  });

  describe("isW3CDimensionValue", () => {
    it("should return true for valid dimension with px", () => {
      const dim: W3CDimensionValue = { value: 16, unit: "px" };
      expect(isW3CDimensionValue(dim)).toBe(true);
    });

    it("should return true for valid dimension with rem", () => {
      const dim: W3CDimensionValue = { value: 1.5, unit: "rem" };
      expect(isW3CDimensionValue(dim)).toBe(true);
    });

    it("should return true for zero value", () => {
      const dim: W3CDimensionValue = { value: 0, unit: "px" };
      expect(isW3CDimensionValue(dim)).toBe(true);
    });

    it("should return true for negative value", () => {
      const dim: W3CDimensionValue = { value: -10, unit: "px" };
      expect(isW3CDimensionValue(dim)).toBe(true);
    });

    it("should return false for null", () => {
      expect(isW3CDimensionValue(null)).toBe(false);
    });

    it("should return false for string", () => {
      expect(isW3CDimensionValue("16px")).toBe(false);
    });

    it("should return false for invalid unit", () => {
      expect(isW3CDimensionValue({ value: 16, unit: "em" })).toBe(false);
      expect(isW3CDimensionValue({ value: 16, unit: "%" })).toBe(false);
    });

    it("should return false for non-number value", () => {
      expect(isW3CDimensionValue({ value: "16", unit: "px" })).toBe(false);
    });
  });

  describe("isW3CDurationValue", () => {
    it("should return true for valid duration with ms", () => {
      const dur: W3CDurationValue = { value: 500, unit: "ms" };
      expect(isW3CDurationValue(dur)).toBe(true);
    });

    it("should return true for valid duration with s", () => {
      const dur: W3CDurationValue = { value: 0.5, unit: "s" };
      expect(isW3CDurationValue(dur)).toBe(true);
    });

    it("should return true for zero value", () => {
      const dur: W3CDurationValue = { value: 0, unit: "ms" };
      expect(isW3CDurationValue(dur)).toBe(true);
    });

    it("should return false for null", () => {
      expect(isW3CDurationValue(null)).toBe(false);
    });

    it("should return false for string", () => {
      expect(isW3CDurationValue("500ms")).toBe(false);
    });

    it("should return false for invalid unit", () => {
      expect(isW3CDurationValue({ value: 500, unit: "min" })).toBe(false);
    });
  });

  describe("isW3CTokenRef", () => {
    it("should return true for valid $ref", () => {
      const ref: W3CTokenRef = { $ref: "#/colors/primary" };
      expect(isW3CTokenRef(ref)).toBe(true);
    });

    it("should return true for nested path", () => {
      const ref: W3CTokenRef = { $ref: "#/colors/brand/primary/500" };
      expect(isW3CTokenRef(ref)).toBe(true);
    });

    it("should return false for null", () => {
      expect(isW3CTokenRef(null)).toBe(false);
    });

    it("should return false for string alias", () => {
      expect(isW3CTokenRef("{colors.primary}")).toBe(false);
    });

    it("should return false for missing $ref property", () => {
      expect(isW3CTokenRef({ ref: "#/colors/primary" })).toBe(false);
    });

    it("should return false for non-string $ref", () => {
      expect(isW3CTokenRef({ $ref: 123 })).toBe(false);
    });
  });

  describe("isW3CStrokeStyleObject", () => {
    it("should return true for valid stroke style object with round lineCap", () => {
      const stroke = {
        dashArray: [{ value: 2, unit: "px" }, { value: 4, unit: "px" }],
        lineCap: "round",
      };
      expect(isW3CStrokeStyleObject(stroke)).toBe(true);
    });

    it("should return true for valid stroke style object with butt lineCap", () => {
      const stroke = {
        dashArray: [{ value: 2, unit: "px" }],
        lineCap: "butt",
      };
      expect(isW3CStrokeStyleObject(stroke)).toBe(true);
    });

    it("should return true for valid stroke style object with square lineCap", () => {
      const stroke = {
        dashArray: [{ value: 2, unit: "px" }],
        lineCap: "square",
      };
      expect(isW3CStrokeStyleObject(stroke)).toBe(true);
    });

    it("should return false for null", () => {
      expect(isW3CStrokeStyleObject(null)).toBe(false);
    });

    it("should return false for string stroke style", () => {
      expect(isW3CStrokeStyleObject("dashed")).toBe(false);
    });

    it("should return false for invalid lineCap", () => {
      const stroke = {
        dashArray: [{ value: 2, unit: "px" }],
        lineCap: "invalid",
      };
      expect(isW3CStrokeStyleObject(stroke)).toBe(false);
    });

    it("should return false for missing dashArray", () => {
      const stroke = { lineCap: "round" };
      expect(isW3CStrokeStyleObject(stroke)).toBe(false);
    });

    it("should return false for non-array dashArray", () => {
      const stroke = { dashArray: "2px 4px", lineCap: "round" };
      expect(isW3CStrokeStyleObject(stroke)).toBe(false);
    });
  });
});
