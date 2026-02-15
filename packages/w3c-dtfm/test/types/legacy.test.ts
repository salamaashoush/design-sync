/**
 * Legacy Types Tests
 *
 * Tests for legacy format type guards.
 */
import { describe, expect, it } from "bun:test";
import {
  isLegacyColor,
  isLegacyDimension,
  isLegacyDuration,
  isLegacyTokenAlias,
} from "../../src/types/legacy";

describe("Legacy Types", () => {
  describe("isLegacyColor", () => {
    it("should return true for 3-digit hex", () => {
      expect(isLegacyColor("#f00")).toBe(true);
      expect(isLegacyColor("#abc")).toBe(true);
    });

    it("should return true for 6-digit hex", () => {
      expect(isLegacyColor("#ff0000")).toBe(true);
      expect(isLegacyColor("#aabbcc")).toBe(true);
    });

    it("should return true for 8-digit hex (with alpha)", () => {
      expect(isLegacyColor("#ff0000ff")).toBe(true);
      expect(isLegacyColor("#aabbccdd")).toBe(true);
    });

    // Note: isLegacyColor only checks for # prefix, not full color validity
    it("should return false for rgb() format (not # prefixed)", () => {
      expect(isLegacyColor("rgb(255, 0, 0)")).toBe(false);
    });

    it("should return false for named colors (not # prefixed)", () => {
      expect(isLegacyColor("red")).toBe(false);
    });

    it("should return false for W3C color object", () => {
      expect(isLegacyColor({ colorSpace: "srgb", components: [1, 0, 0] })).toBe(false);
    });

    it("should return false for null", () => {
      expect(isLegacyColor(null)).toBe(false);
    });

    it("should return false for number", () => {
      expect(isLegacyColor(123)).toBe(false);
    });

    it("should return false for random string", () => {
      expect(isLegacyColor("not-a-color")).toBe(false);
    });
  });

  describe("isLegacyDimension", () => {
    it("should return true for px values", () => {
      expect(isLegacyDimension("16px")).toBe(true);
      expect(isLegacyDimension("0px")).toBe(true);
      expect(isLegacyDimension("-10px")).toBe(true);
      expect(isLegacyDimension("1.5px")).toBe(true);
    });

    it("should return true for rem values", () => {
      expect(isLegacyDimension("1rem")).toBe(true);
      expect(isLegacyDimension("0rem")).toBe(true);
      expect(isLegacyDimension("1.5rem")).toBe(true);
    });

    // Note: Only px and rem are valid W3C dimension units
    it("should return false for em values", () => {
      expect(isLegacyDimension("1em")).toBe(false);
    });

    it("should return false for percentage values", () => {
      expect(isLegacyDimension("100%")).toBe(false);
    });

    it("should return false for W3C dimension object", () => {
      expect(isLegacyDimension({ value: 16, unit: "px" })).toBe(false);
    });

    it("should return false for null", () => {
      expect(isLegacyDimension(null)).toBe(false);
    });

    it("should return false for plain number", () => {
      expect(isLegacyDimension(16)).toBe(false);
    });

    it("should return false for string without unit", () => {
      expect(isLegacyDimension("16")).toBe(false);
    });
  });

  describe("isLegacyDuration", () => {
    it("should return true for ms values", () => {
      expect(isLegacyDuration("500ms")).toBe(true);
      expect(isLegacyDuration("0ms")).toBe(true);
      expect(isLegacyDuration("100ms")).toBe(true);
    });

    it("should return true for s values", () => {
      expect(isLegacyDuration("1s")).toBe(true);
      expect(isLegacyDuration("0.5s")).toBe(true);
      expect(isLegacyDuration("2s")).toBe(true);
    });

    it("should return false for W3C duration object", () => {
      expect(isLegacyDuration({ value: 500, unit: "ms" })).toBe(false);
    });

    it("should return false for null", () => {
      expect(isLegacyDuration(null)).toBe(false);
    });

    it("should return false for plain number", () => {
      expect(isLegacyDuration(500)).toBe(false);
    });
  });

  describe("isLegacyTokenAlias", () => {
    it("should return true for curly brace alias", () => {
      expect(isLegacyTokenAlias("{colors.primary}")).toBe(true);
      expect(isLegacyTokenAlias("{spacing.md}")).toBe(true);
    });

    it("should return true for nested alias", () => {
      expect(isLegacyTokenAlias("{colors.brand.primary.500}")).toBe(true);
    });

    it("should return true for alias with $value suffix", () => {
      expect(isLegacyTokenAlias("{colors.primary.$value}")).toBe(true);
    });

    it("should return false for $ref format", () => {
      expect(isLegacyTokenAlias({ $ref: "#/colors/primary" })).toBe(false);
    });

    it("should return false for null", () => {
      expect(isLegacyTokenAlias(null)).toBe(false);
    });

    it("should return false for string without braces", () => {
      expect(isLegacyTokenAlias("colors.primary")).toBe(false);
    });

    it("should return false for string with only opening brace", () => {
      expect(isLegacyTokenAlias("{colors.primary")).toBe(false);
    });
  });

});
