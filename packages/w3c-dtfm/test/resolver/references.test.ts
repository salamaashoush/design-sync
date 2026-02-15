/**
 * References Tests
 *
 * Tests for token reference handling ($ref and aliases).
 */
import { describe, expect, it } from "bun:test";
import {
  isTokenReference,
  parseReference,
  pathToW3CRef,
  pathToLegacyAlias,
  normalizeReference,
  collectReferencesFromValue,
  collectAllReferences,
  replaceReferences,
  hasReferences,
  getTokenByPath,
  getTokenValueByPath,
  getTokenTypeByPath,
  isValidReferencePath,
} from "../../src/resolver/references";

describe("Token References", () => {
  describe("isTokenReference", () => {
    it("should return true for $ref object", () => {
      expect(isTokenReference({ $ref: "#/colors/primary" })).toBe(true);
    });

    it("should return true for curly brace alias", () => {
      expect(isTokenReference("{colors.primary}")).toBe(true);
    });

    it("should return false for regular string", () => {
      expect(isTokenReference("#ff0000")).toBe(false);
      expect(isTokenReference("16px")).toBe(false);
    });

    it("should return false for regular object", () => {
      expect(isTokenReference({ colorSpace: "srgb", components: [1, 0, 0] })).toBe(false);
    });

    it("should return false for null/undefined", () => {
      expect(isTokenReference(null)).toBe(false);
      expect(isTokenReference(undefined)).toBe(false);
    });
  });

  describe("parseReference", () => {
    it("should parse $ref to path", () => {
      const path = parseReference({ $ref: "#/colors/primary" });
      expect(path).toBe("colors.primary");
    });

    it("should parse nested $ref", () => {
      const path = parseReference({ $ref: "#/brand/colors/primary/500" });
      expect(path).toBe("brand.colors.primary.500");
    });

    it("should parse curly brace alias", () => {
      const path = parseReference("{colors.primary}");
      expect(path).toBe("colors.primary");
    });

    it("should remove .$value suffix from alias", () => {
      const path = parseReference("{colors.primary.$value}");
      expect(path).toBe("colors.primary");
    });

    it("should throw for invalid reference", () => {
      expect(() => parseReference({} as any)).toThrow();
    });
  });

  describe("pathToW3CRef", () => {
    it("should convert path to $ref format", () => {
      const ref = pathToW3CRef("colors.primary");
      expect(ref).toEqual({ $ref: "#/colors/primary" });
    });

    it("should handle nested paths", () => {
      const ref = pathToW3CRef("brand.colors.primary.500");
      expect(ref).toEqual({ $ref: "#/brand/colors/primary/500" });
    });
  });

  describe("pathToLegacyAlias", () => {
    it("should convert path to curly brace alias", () => {
      const alias = pathToLegacyAlias("colors.primary");
      expect(alias).toBe("{colors.primary}");
    });

    it("should handle nested paths", () => {
      const alias = pathToLegacyAlias("brand.colors.primary.500");
      expect(alias).toBe("{brand.colors.primary.500}");
    });
  });

  describe("normalizeReference", () => {
    it("should normalize $ref to path", () => {
      const path = normalizeReference({ $ref: "#/colors/primary" });
      expect(path).toBe("colors.primary");
    });

    it("should normalize alias to path", () => {
      const path = normalizeReference("{colors.primary}");
      expect(path).toBe("colors.primary");
    });

    it("should return null for non-reference", () => {
      expect(normalizeReference("#ff0000")).toBeNull();
      expect(normalizeReference(123)).toBeNull();
    });
  });

  describe("collectReferencesFromValue", () => {
    it("should collect single reference", () => {
      const refs = collectReferencesFromValue("{colors.primary}");
      expect(refs).toEqual(["colors.primary"]);
    });

    it("should collect $ref", () => {
      const refs = collectReferencesFromValue({ $ref: "#/colors/primary" });
      expect(refs).toEqual(["colors.primary"]);
    });

    it("should collect references from object properties", () => {
      const refs = collectReferencesFromValue({
        color: "{colors.primary}",
        width: "{spacing.md}",
      });
      expect(refs).toContain("colors.primary");
      expect(refs).toContain("spacing.md");
    });

    it("should collect references from arrays", () => {
      const refs = collectReferencesFromValue([
        { color: "{colors.red}", position: 0 },
        { color: "{colors.blue}", position: 1 },
      ]);
      expect(refs).toContain("colors.red");
      expect(refs).toContain("colors.blue");
    });

    it("should return empty array for non-reference values", () => {
      expect(collectReferencesFromValue("#ff0000")).toEqual([]);
      expect(collectReferencesFromValue(16)).toEqual([]);
    });
  });

  describe("collectAllReferences", () => {
    it("should collect all references from tokens", () => {
      const tokens = {
        colors: {
          primary: { $type: "color", $value: "#ff0000" },
          alias: { $type: "color", $value: "{colors.primary}" },
        },
      };

      const refs = collectAllReferences(tokens);

      expect(refs.has("colors.alias")).toBe(true);
      expect(refs.get("colors.alias")?.refs).toContain("colors.primary");
    });

    it("should handle nested groups", () => {
      const tokens = {
        brand: {
          colors: {
            $type: "color",
            primary: { $value: "#ff0000" },
            secondary: { $value: "{brand.colors.primary}" },
          },
        },
      };

      const refs = collectAllReferences(tokens);

      expect(refs.has("brand.colors.secondary")).toBe(true);
    });

    it("should include token values", () => {
      const tokens = {
        colors: {
          primary: { $type: "color", $value: "#ff0000" },
        },
      };

      const refs = collectAllReferences(tokens);

      expect(refs.get("colors.primary")?.value).toBe("#ff0000");
    });
  });

  describe("replaceReferences", () => {
    it("should replace single reference", () => {
      const result = replaceReferences("{colors.primary}", (path) => {
        return path === "colors.primary" ? "#ff0000" : undefined;
      });
      expect(result).toBe("#ff0000");
    });

    it("should replace $ref", () => {
      const result = replaceReferences({ $ref: "#/colors/primary" }, (path) => {
        return path === "colors.primary" ? "#ff0000" : undefined;
      });
      expect(result).toBe("#ff0000");
    });

    it("should replace references in objects", () => {
      const result = replaceReferences(
        {
          color: "{colors.primary}",
          width: "{spacing.md}",
        },
        (path) => {
          if (path === "colors.primary") return "#ff0000";
          if (path === "spacing.md") return { value: 16, unit: "px" };
          return undefined;
        }
      );

      expect(result).toEqual({
        color: "#ff0000",
        width: { value: 16, unit: "px" },
      });
    });

    it("should replace references in arrays", () => {
      const result = replaceReferences(
        ["{colors.red}", "{colors.blue}"],
        (path) => {
          if (path === "colors.red") return "#ff0000";
          if (path === "colors.blue") return "#0000ff";
          return undefined;
        }
      );

      expect(result).toEqual(["#ff0000", "#0000ff"]);
    });

    it("should not modify non-reference values", () => {
      const result = replaceReferences("#ff0000", () => "replaced");
      expect(result).toBe("#ff0000");
    });
  });

  describe("hasReferences", () => {
    it("should return true for reference value", () => {
      expect(hasReferences("{colors.primary}")).toBe(true);
      expect(hasReferences({ $ref: "#/colors/primary" })).toBe(true);
    });

    it("should return true for object with reference", () => {
      expect(hasReferences({ color: "{colors.primary}" })).toBe(true);
    });

    it("should return true for array with reference", () => {
      expect(hasReferences(["{colors.red}", "#0000ff"])).toBe(true);
    });

    it("should return false for non-reference values", () => {
      expect(hasReferences("#ff0000")).toBe(false);
      expect(hasReferences(16)).toBe(false);
      expect(hasReferences({ colorSpace: "srgb", components: [1, 0, 0] })).toBe(false);
    });
  });

  describe("getTokenByPath", () => {
    it("should get token by path", () => {
      const tokens = {
        colors: {
          primary: { $type: "color", $value: "#ff0000" },
        },
      };

      const token = getTokenByPath(tokens, "colors.primary");
      expect(token).toEqual({ $type: "color", $value: "#ff0000" });
    });

    it("should get nested token", () => {
      const tokens = {
        brand: {
          colors: {
            primary: { $type: "color", $value: "#ff0000" },
          },
        },
      };

      const token = getTokenByPath(tokens, "brand.colors.primary");
      expect(token).toEqual({ $type: "color", $value: "#ff0000" });
    });

    it("should return undefined for non-existent path", () => {
      const tokens = { colors: {} };
      expect(getTokenByPath(tokens, "colors.primary")).toBeUndefined();
    });
  });

  describe("getTokenValueByPath", () => {
    it("should get $value by path", () => {
      const tokens = {
        colors: {
          primary: { $type: "color", $value: "#ff0000" },
        },
      };

      const value = getTokenValueByPath(tokens, "colors.primary");
      expect(value).toBe("#ff0000");
    });

    it("should return undefined if no $value", () => {
      const tokens = {
        colors: {
          $type: "color",
        },
      };

      const value = getTokenValueByPath(tokens, "colors");
      expect(value).toBeUndefined();
    });
  });

  describe("getTokenTypeByPath", () => {
    it("should get $type by path", () => {
      const tokens = {
        colors: {
          primary: { $type: "color", $value: "#ff0000" },
        },
      };

      const type = getTokenTypeByPath(tokens, "colors.primary");
      expect(type).toBe("color");
    });

    it("should return undefined if no $type", () => {
      const tokens = {
        colors: {
          primary: { $value: "#ff0000" },
        },
      };

      const type = getTokenTypeByPath(tokens, "colors.primary");
      expect(type).toBeUndefined();
    });
  });

  describe("isValidReferencePath", () => {
    it("should return true for valid paths", () => {
      expect(isValidReferencePath("colors.primary")).toBe(true);
      expect(isValidReferencePath("brand.colors.primary.500")).toBe(true);
      expect(isValidReferencePath("spacing")).toBe(true);
    });

    it("should return false for empty path", () => {
      expect(isValidReferencePath("")).toBe(false);
    });

    it("should return false for path starting with dot", () => {
      expect(isValidReferencePath(".colors.primary")).toBe(false);
    });

    it("should return false for path ending with dot", () => {
      expect(isValidReferencePath("colors.primary.")).toBe(false);
    });

    it("should return false for consecutive dots", () => {
      expect(isValidReferencePath("colors..primary")).toBe(false);
    });
  });
});
