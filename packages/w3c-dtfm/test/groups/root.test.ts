/**
 * $root Token Tests
 *
 * Tests for W3C $root token handling.
 */
import { describe, expect, it } from "bun:test";
import {
  hasRootToken,
  getRootToken,
  getRootTokenType,
  extractRootTokens,
  expandRootTokens,
  getRootTokenPath,
  createFullRootToken,
  isRootTokenPath,
  validateRootToken,
  mergeRootWithGroupDefaults,
} from "../../src/groups/root";

describe("$root Token Handling", () => {
  describe("hasRootToken", () => {
    it("should return true for group with $root token", () => {
      const group = {
        $type: "color",
        $root: { $value: "#ff0000" },
        primary: { $value: "#0000ff" },
      };
      expect(hasRootToken(group)).toBe(true);
    });

    it("should return false for group without $root", () => {
      const group = {
        $type: "color",
        primary: { $value: "#ff0000" },
      };
      expect(hasRootToken(group)).toBe(false);
    });

    it("should return false for $root without $value", () => {
      const group = {
        $root: { $description: "Not a token" },
      };
      expect(hasRootToken(group)).toBe(false);
    });

    it("should return false for non-object $root", () => {
      const group = {
        $root: "#ff0000",
      };
      expect(hasRootToken(group)).toBe(false);
    });
  });

  describe("getRootToken", () => {
    it("should return $root token", () => {
      const group = {
        $root: { $value: "#ff0000" },
      };
      expect(getRootToken(group)).toEqual({ $value: "#ff0000" });
    });

    it("should return null for group without $root", () => {
      const group = {
        primary: { $value: "#ff0000" },
      };
      expect(getRootToken(group)).toBeNull();
    });
  });

  describe("getRootTokenType", () => {
    it("should return $type from $root token", () => {
      const group = {
        $root: { $type: "color", $value: "#ff0000" },
      };
      expect(getRootTokenType(group)).toBe("color");
    });

    it("should inherit $type from group if $root has no $type", () => {
      const group = {
        $type: "color",
        $root: { $value: "#ff0000" },
      };
      expect(getRootTokenType(group)).toBe("color");
    });

    it("should return undefined if no $type available", () => {
      const group = {
        $root: { $value: "#ff0000" },
      };
      expect(getRootTokenType(group)).toBeUndefined();
    });

    it("should return undefined for group without $root", () => {
      const group = {
        $type: "color",
        primary: { $value: "#ff0000" },
      };
      expect(getRootTokenType(group)).toBeUndefined();
    });
  });

  describe("extractRootTokens", () => {
    it("should extract all $root tokens from tokens", () => {
      const tokens = {
        colors: {
          $type: "color",
          $root: { $value: "#ff0000" },
          primary: { $value: "#0000ff" },
        },
        spacing: {
          $type: "dimension",
          $root: { $value: { value: 16, unit: "px" } },
        },
      };

      const rootTokens = extractRootTokens(tokens);

      expect(rootTokens.size).toBe(2);
      expect(rootTokens.has("colors")).toBe(true);
      expect(rootTokens.has("spacing")).toBe(true);
      expect(rootTokens.get("colors")?.token).toEqual({ $value: "#ff0000" });
      expect(rootTokens.get("colors")?.type).toBe("color");
    });

    it("should handle nested groups with $root", () => {
      const tokens = {
        brand: {
          colors: {
            $type: "color",
            $root: { $value: "#ff0000" },
          },
        },
      };

      const rootTokens = extractRootTokens(tokens);

      expect(rootTokens.has("brand.colors")).toBe(true);
    });

    it("should return empty map if no $root tokens", () => {
      const tokens = {
        colors: {
          primary: { $value: "#ff0000" },
        },
      };

      const rootTokens = extractRootTokens(tokens);

      expect(rootTokens.size).toBe(0);
    });
  });

  describe("expandRootTokens", () => {
    it("should remove $root from processed output", () => {
      const tokens = {
        colors: {
          $type: "color",
          $root: { $value: "#ff0000" },
          primary: { $value: "#0000ff" },
        },
      };

      const expanded = expandRootTokens(tokens);

      expect((expanded as any).colors.$root).toBeUndefined();
      expect((expanded as any).colors.$type).toBe("color");
      expect((expanded as any).colors.primary).toEqual({ $value: "#0000ff" });
    });

    it("should preserve other $ properties", () => {
      const tokens = {
        colors: {
          $type: "color",
          $description: "Color tokens",
          $root: { $value: "#ff0000" },
        },
      };

      const expanded = expandRootTokens(tokens);

      expect((expanded as any).colors.$description).toBe("Color tokens");
    });
  });

  describe("getRootTokenPath", () => {
    it("should return the group path", () => {
      expect(getRootTokenPath("colors")).toBe("colors");
      expect(getRootTokenPath("brand.colors")).toBe("brand.colors");
    });
  });

  describe("createFullRootToken", () => {
    it("should add $type from group if not in root", () => {
      const root = { $value: "#ff0000" };
      const full = createFullRootToken(root, "color");

      expect(full.$type).toBe("color");
      expect(full.$value).toBe("#ff0000");
    });

    it("should not override existing $type", () => {
      const root = { $type: "dimension", $value: "16px" };
      const full = createFullRootToken(root, "color");

      expect(full.$type).toBe("dimension");
    });

    it("should work without group type", () => {
      const root = { $value: "#ff0000" };
      const full = createFullRootToken(root);

      expect(full.$type).toBeUndefined();
      expect(full.$value).toBe("#ff0000");
    });
  });

  describe("isRootTokenPath", () => {
    it("should return true for path to group with $root", () => {
      const tokens = {
        colors: {
          $root: { $value: "#ff0000" },
        },
      };

      expect(isRootTokenPath("colors", tokens)).toBe(true);
    });

    it("should return false for path without $root", () => {
      const tokens = {
        colors: {
          primary: { $value: "#ff0000" },
        },
      };

      expect(isRootTokenPath("colors", tokens)).toBe(false);
    });

    it("should handle nested paths", () => {
      const tokens = {
        brand: {
          colors: {
            $root: { $value: "#ff0000" },
          },
        },
      };

      expect(isRootTokenPath("brand.colors", tokens)).toBe(true);
      expect(isRootTokenPath("brand", tokens)).toBe(false);
    });

    it("should return false for non-existent path", () => {
      const tokens = {};
      expect(isRootTokenPath("colors", tokens)).toBe(false);
    });
  });

  describe("validateRootToken", () => {
    it("should validate valid $root token", () => {
      const root = { $value: "#ff0000" };
      const result = validateRootToken(root, "colors");

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject non-object $root", () => {
      const result = validateRootToken("#ff0000", "colors");

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("must be an object"))).toBe(true);
    });

    it("should reject $root without $value", () => {
      const root = { $description: "Missing value" };
      const result = validateRootToken(root, "colors");

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("must have a $value"))).toBe(true);
    });
  });

  describe("mergeRootWithGroupDefaults", () => {
    it("should inherit $type from group", () => {
      const root = { $value: "#ff0000" };
      const group = { $type: "color" };
      const merged = mergeRootWithGroupDefaults(root, group);

      expect(merged.$type).toBe("color");
    });

    it("should inherit $description from group", () => {
      const root = { $value: "#ff0000" };
      const group = { $description: "Color group" };
      const merged = mergeRootWithGroupDefaults(root, group);

      expect(merged.$description).toBe("Color group");
    });

    it("should inherit $deprecated from group", () => {
      const root = { $value: "#ff0000" };
      const group = { $deprecated: true };
      const merged = mergeRootWithGroupDefaults(root, group);

      expect(merged.$deprecated).toBe(true);
    });

    it("should inherit $extensions from group", () => {
      const root = { $value: "#ff0000" };
      const group = { $extensions: { custom: true } };
      const merged = mergeRootWithGroupDefaults(root, group);

      expect(merged.$extensions).toEqual({ custom: true });
    });

    it("should not override existing properties in root", () => {
      const root = {
        $value: "#ff0000",
        $type: "dimension",
        $description: "Root description",
      };
      const group = {
        $type: "color",
        $description: "Group description",
      };
      const merged = mergeRootWithGroupDefaults(root, group);

      expect(merged.$type).toBe("dimension");
      expect(merged.$description).toBe("Root description");
    });
  });
});
