/**
 * Alias Utilities Tests
 *
 * Tests for token alias and $ref handling.
 */
import { describe, expect, it } from "bun:test";
import {
  normalizeTokenAlias,
  normalizeTokenRef,
  normalizeReference,
  pathToAlias,
  pathToRef,
  isValidAlias,
  isValidRef,
} from "../src/alias";

describe("Alias Utilities", () => {
  describe("normalizeTokenAlias", () => {
    it("should remove curly braces", () => {
      expect(normalizeTokenAlias("{colors.primary}")).toBe("colors.primary");
    });

    it("should handle nested paths", () => {
      expect(normalizeTokenAlias("{brand.colors.primary.500}")).toBe(
        "brand.colors.primary.500"
      );
    });

    it("should remove .$value suffix", () => {
      expect(normalizeTokenAlias("{colors.primary.$value}")).toBe("colors.primary");
    });
  });

  describe("normalizeTokenRef", () => {
    it("should convert $ref to path", () => {
      expect(normalizeTokenRef({ $ref: "#/colors/primary" })).toBe("colors.primary");
    });

    it("should handle nested paths", () => {
      expect(normalizeTokenRef({ $ref: "#/brand/colors/primary/500" })).toBe(
        "brand.colors.primary.500"
      );
    });
  });

  describe("normalizeReference", () => {
    it("should normalize alias", () => {
      expect(normalizeReference("{colors.primary}")).toBe("colors.primary");
    });

    it("should normalize $ref", () => {
      expect(normalizeReference({ $ref: "#/colors/primary" })).toBe("colors.primary");
    });
  });

  describe("pathToAlias", () => {
    it("should convert path to curly brace alias", () => {
      expect(pathToAlias("colors.primary")).toBe("{colors.primary}");
    });

    it("should handle nested paths", () => {
      expect(pathToAlias("brand.colors.primary.500")).toBe("{brand.colors.primary.500}");
    });
  });

  describe("pathToRef", () => {
    it("should convert path to $ref", () => {
      expect(pathToRef("colors.primary")).toEqual({ $ref: "#/colors/primary" });
    });

    it("should handle nested paths", () => {
      expect(pathToRef("brand.colors.primary.500")).toEqual({
        $ref: "#/brand/colors/primary/500",
      });
    });
  });

  describe("isValidAlias", () => {
    it("should return true for valid aliases", () => {
      expect(isValidAlias("{colors.primary}")).toBe(true);
      expect(isValidAlias("{brand.colors.primary.500}")).toBe(true);
      expect(isValidAlias("{spacing}")).toBe(true);
    });

    it("should return false for invalid aliases", () => {
      expect(isValidAlias("colors.primary")).toBe(false);
      expect(isValidAlias("{colors.primary")).toBe(false);
      expect(isValidAlias("colors.primary}")).toBe(false);
      expect(isValidAlias("{{colors.primary}}")).toBe(false);
      expect(isValidAlias("{colors{primary}}")).toBe(false);
      expect(isValidAlias("{}")).toBe(false);
    });
  });

  describe("isValidRef", () => {
    it("should return true for valid $ref objects", () => {
      expect(isValidRef({ $ref: "#/colors/primary" })).toBe(true);
      expect(isValidRef({ $ref: "#/brand/colors/primary/500" })).toBe(true);
    });

    it("should return false for invalid $ref objects", () => {
      expect(isValidRef({ $ref: "colors/primary" })).toBe(false);
      expect(isValidRef({ $ref: 123 })).toBe(false);
      expect(isValidRef({ ref: "#/colors/primary" })).toBe(false);
      expect(isValidRef("not-an-object")).toBe(false);
      expect(isValidRef(null)).toBe(false);
      expect(isValidRef(undefined)).toBe(false);
    });
  });
});
