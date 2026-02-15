/**
 * Guards Tests
 *
 * Tests for type guard functions.
 */
import { describe, expect, it } from "bun:test";
import {
  isDesignTokenGroup,
  isDesignToken,
  isDesignTokenLike,
  hasTokenExtensions,
  hasModeExtension,
  hasModesExtension,
  isCompositeToken,
  hasTokenAlias,
  isTokenAlias,
  isTokenRef,
  isReference,
  isDeprecatedToken,
  getDeprecationMessage,
  isColorToken,
  isCubicBezierToken,
  isFontFamilyToken,
  isFontWeightToken,
  isDimensionToken,
  isNumberToken,
  isDurationToken,
  isStrokeStyleToken,
  isShadowToken,
  isBorderToken,
  isTransitionToken,
  isGradientToken,
  isTypographyToken,
  isOtherToken,
} from "../src/guards";

describe("Guards", () => {
  describe("isDesignTokenGroup", () => {
    it("should return true for group with $type but no $value", () => {
      const group = { $type: "color" };
      expect(isDesignTokenGroup(group)).toBe(true);
    });

    it("should return false for token with $value", () => {
      const token = { $type: "color", $value: "#ff0000" };
      expect(isDesignTokenGroup(token)).toBe(false);
    });

    it("should return false for non-object", () => {
      expect(isDesignTokenGroup("string")).toBe(false);
      expect(isDesignTokenGroup(null)).toBe(false);
    });
  });

  describe("isDesignToken", () => {
    it("should return true for token with $type and $value", () => {
      const token = { $type: "color", $value: "#ff0000" };
      expect(isDesignToken(token)).toBe(true);
    });

    it("should return false without $type", () => {
      const token = { $value: "#ff0000" };
      expect(isDesignToken(token)).toBe(false);
    });

    it("should return false without $value", () => {
      const token = { $type: "color" };
      expect(isDesignToken(token)).toBe(false);
    });
  });

  describe("isDesignTokenLike", () => {
    it("should return true for object with $value", () => {
      const token = { $value: "#ff0000" };
      expect(isDesignTokenLike(token)).toBe(true);
    });

    it("should return false without $value", () => {
      const token = { $type: "color" };
      expect(isDesignTokenLike(token)).toBe(false);
    });
  });

  describe("hasTokenExtensions", () => {
    it("should return true for token with $extensions", () => {
      const token = { $value: "#ff0000", $extensions: { custom: true } };
      expect(hasTokenExtensions(token)).toBe(true);
    });

    it("should return false without $extensions", () => {
      const token = { $value: "#ff0000" };
      expect(hasTokenExtensions(token)).toBe(false);
    });
  });

  describe("hasModeExtension", () => {
    it("should return true for token with mode extension", () => {
      const token = { $value: "#ff0000", $extensions: { mode: "dark" } };
      expect(hasModeExtension(token)).toBe(true);
    });

    it("should return false without mode extension", () => {
      const token = { $value: "#ff0000", $extensions: { custom: true } };
      expect(hasModeExtension(token)).toBe(false);
    });
  });

  describe("hasModesExtension", () => {
    it("should return true for token with modes extension", () => {
      const token = {
        $value: "#ff0000",
        $extensions: { modes: { dark: "#000000" } },
      };
      expect(hasModesExtension(token)).toBe(true);
    });

    it("should return false without modes extension", () => {
      const token = { $value: "#ff0000", $extensions: { mode: "dark" } };
      expect(hasModesExtension(token)).toBe(false);
    });
  });

  describe("isCompositeToken", () => {
    it("should return true for border token", () => {
      const token = {
        $type: "border",
        $value: { color: "#000", width: "1px", style: "solid" },
      };
      expect(isCompositeToken(token)).toBe(true);
    });

    it("should return true for shadow token", () => {
      const token = {
        $type: "shadow",
        $value: { color: "#000", offsetX: "0px", offsetY: "2px", blur: "4px", spread: "0px" },
      };
      expect(isCompositeToken(token)).toBe(true);
    });

    it("should return true for transition token", () => {
      const token = {
        $type: "transition",
        $value: { duration: "200ms", timingFunction: [0, 0, 1, 1], delay: "0ms" },
      };
      expect(isCompositeToken(token)).toBe(true);
    });

    it("should return true for gradient token", () => {
      const token = {
        $type: "gradient",
        $value: [{ color: "#ff0000", position: 0 }],
      };
      expect(isCompositeToken(token)).toBe(true);
    });

    it("should return true for typography token", () => {
      const token = {
        $type: "typography",
        $value: { fontFamily: "Arial", fontSize: "16px" },
      };
      expect(isCompositeToken(token)).toBe(true);
    });

    it("should return true for strokeStyle token", () => {
      const token = {
        $type: "strokeStyle",
        $value: "solid",
      };
      expect(isCompositeToken(token)).toBe(true);
    });

    it("should return false for color token", () => {
      const token = { $type: "color", $value: "#ff0000" };
      expect(isCompositeToken(token)).toBe(false);
    });
  });

  describe("hasTokenAlias", () => {
    it("should return true for string containing alias", () => {
      expect(hasTokenAlias("{colors.primary}")).toBe(true);
    });

    it("should return true for embedded alias", () => {
      expect(hasTokenAlias("var({colors.primary})")).toBe(true);
    });

    it("should return false for non-alias string", () => {
      expect(hasTokenAlias("#ff0000")).toBe(false);
    });
  });

  describe("isTokenAlias", () => {
    it("should return true for exact alias", () => {
      expect(isTokenAlias("{colors.primary}")).toBe(true);
    });

    it("should return false for embedded alias", () => {
      expect(isTokenAlias("var({colors.primary})")).toBe(false);
    });

    it("should return false for non-alias", () => {
      expect(isTokenAlias("#ff0000")).toBe(false);
    });
  });

  describe("isTokenRef", () => {
    it("should return true for $ref object", () => {
      expect(isTokenRef({ $ref: "#/colors/primary" })).toBe(true);
    });

    it("should return false for non-object", () => {
      expect(isTokenRef("{colors.primary}")).toBe(false);
    });

    it("should return false for object without $ref", () => {
      expect(isTokenRef({ path: "colors.primary" })).toBe(false);
    });

    it("should return false for non-string $ref", () => {
      expect(isTokenRef({ $ref: 123 })).toBe(false);
    });
  });

  describe("isReference", () => {
    it("should return true for alias", () => {
      expect(isReference("{colors.primary}")).toBe(true);
    });

    it("should return true for $ref", () => {
      expect(isReference({ $ref: "#/colors/primary" })).toBe(true);
    });

    it("should return false for non-reference", () => {
      expect(isReference("#ff0000")).toBe(false);
    });
  });

  describe("isDeprecatedToken", () => {
    it("should return true for token with $deprecated", () => {
      const token = { $value: "#ff0000", $deprecated: true };
      expect(isDeprecatedToken(token)).toBe(true);
    });

    it("should return true for string deprecation", () => {
      const token = { $value: "#ff0000", $deprecated: "Use colors.new instead" };
      expect(isDeprecatedToken(token)).toBe(true);
    });

    it("should return false without $deprecated", () => {
      const token = { $value: "#ff0000" };
      expect(isDeprecatedToken(token)).toBe(false);
    });
  });

  describe("getDeprecationMessage", () => {
    it("should return string deprecation message", () => {
      const token = { $value: "#ff0000", $deprecated: "Use colors.new" };
      expect(getDeprecationMessage(token)).toBe("Use colors.new");
    });

    it("should return default for boolean deprecation", () => {
      const token = { $value: "#ff0000", $deprecated: true };
      expect(getDeprecationMessage(token)).toBe("This token is deprecated");
    });

    it("should return undefined for non-deprecated token", () => {
      const token = { $value: "#ff0000" };
      expect(getDeprecationMessage(token)).toBeUndefined();
    });
  });

  describe("Token type guards", () => {
    it("isColorToken should identify color tokens", () => {
      expect(isColorToken({ $type: "color", $value: "#ff0000" })).toBe(true);
      expect(isColorToken({ $type: "dimension", $value: "16px" })).toBe(false);
    });

    it("isCubicBezierToken should identify cubicBezier tokens", () => {
      expect(isCubicBezierToken({ $type: "cubicBezier", $value: [0, 0, 1, 1] })).toBe(true);
      expect(isCubicBezierToken({ $type: "color", $value: "#ff0000" })).toBe(false);
    });

    it("isFontFamilyToken should identify fontFamily tokens", () => {
      expect(isFontFamilyToken({ $type: "fontFamily", $value: ["Arial"] })).toBe(true);
      expect(isFontFamilyToken({ $type: "color", $value: "#ff0000" })).toBe(false);
    });

    it("isFontWeightToken should identify fontWeight tokens", () => {
      expect(isFontWeightToken({ $type: "fontWeight", $value: 400 })).toBe(true);
      expect(isFontWeightToken({ $type: "color", $value: "#ff0000" })).toBe(false);
    });

    it("isDimensionToken should identify dimension tokens", () => {
      expect(isDimensionToken({ $type: "dimension", $value: "16px" })).toBe(true);
      expect(isDimensionToken({ $type: "color", $value: "#ff0000" })).toBe(false);
    });

    it("isNumberToken should identify number tokens", () => {
      expect(isNumberToken({ $type: "number", $value: 1.5 })).toBe(true);
      expect(isNumberToken({ $type: "color", $value: "#ff0000" })).toBe(false);
    });

    it("isDurationToken should identify duration tokens", () => {
      expect(isDurationToken({ $type: "duration", $value: "200ms" })).toBe(true);
      expect(isDurationToken({ $type: "color", $value: "#ff0000" })).toBe(false);
    });

    it("isStrokeStyleToken should identify strokeStyle tokens", () => {
      expect(isStrokeStyleToken({ $type: "strokeStyle", $value: "solid" })).toBe(true);
      expect(isStrokeStyleToken({ $type: "color", $value: "#ff0000" })).toBe(false);
    });

    it("isShadowToken should identify shadow tokens", () => {
      expect(
        isShadowToken({
          $type: "shadow",
          $value: { color: "#000", offsetX: "0px", offsetY: "2px", blur: "4px", spread: "0px" },
        })
      ).toBe(true);
      expect(isShadowToken({ $type: "color", $value: "#ff0000" })).toBe(false);
    });

    it("isBorderToken should identify border tokens", () => {
      expect(
        isBorderToken({
          $type: "border",
          $value: { color: "#000", width: "1px", style: "solid" },
        })
      ).toBe(true);
      expect(isBorderToken({ $type: "color", $value: "#ff0000" })).toBe(false);
    });

    it("isTransitionToken should identify transition tokens", () => {
      expect(
        isTransitionToken({
          $type: "transition",
          $value: { duration: "200ms", timingFunction: [0, 0, 1, 1], delay: "0ms" },
        })
      ).toBe(true);
      expect(isTransitionToken({ $type: "color", $value: "#ff0000" })).toBe(false);
    });

    it("isGradientToken should identify gradient tokens", () => {
      expect(
        isGradientToken({
          $type: "gradient",
          $value: [{ color: "#ff0000", position: 0 }],
        })
      ).toBe(true);
      expect(isGradientToken({ $type: "color", $value: "#ff0000" })).toBe(false);
    });

    it("isTypographyToken should identify typography tokens", () => {
      expect(
        isTypographyToken({
          $type: "typography",
          $value: { fontFamily: "Arial", fontSize: "16px" },
        })
      ).toBe(true);
      expect(isTypographyToken({ $type: "color", $value: "#ff0000" })).toBe(false);
    });

    it("isOtherToken should identify other tokens", () => {
      expect(isOtherToken({ $type: "other", $value: "custom" })).toBe(true);
      expect(isOtherToken({ $type: "color", $value: "#ff0000" })).toBe(false);
    });
  });
});
