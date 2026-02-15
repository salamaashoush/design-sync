/**
 * Type Inference Tests
 *
 * Tests for W3C type inference priority system.
 */
import { describe, expect, it } from "bun:test";
import {
  getExplicitType,
  getInheritedType,
  getReferencedType,
  inferTokenType,
  inferAllTypes,
  findUntyped,
  applyInferredTypes,
  resolveAllTypes,
  allTypesResolvable,
  getTypeInheritanceChain,
  validateTypeConsistency,
} from "../../src/inference";

describe("Type Inference System", () => {
  describe("getExplicitType", () => {
    it("should return $type from token", () => {
      const token = { $type: "color", $value: "#ff0000" };
      expect(getExplicitType(token)).toBe("color");
    });

    it("should return undefined if no $type", () => {
      const token = { $value: "#ff0000" };
      expect(getExplicitType(token)).toBeUndefined();
    });

    it("should return undefined for non-string $type", () => {
      const token = { $type: 123, $value: "#ff0000" };
      expect(getExplicitType(token as any)).toBeUndefined();
    });
  });

  describe("getInheritedType", () => {
    it("should inherit from direct parent group", () => {
      const tokens = {
        colors: {
          $type: "color",
          primary: { $value: "#ff0000" },
        },
      };

      const result = getInheritedType(tokens, "colors.primary");
      expect(result?.type).toBe("color");
      expect(result?.inheritedFrom).toBe("colors");
    });

    it("should inherit from grandparent group", () => {
      const tokens = {
        brand: {
          $type: "color",
          colors: {
            primary: { $value: "#ff0000" },
          },
        },
      };

      const result = getInheritedType(tokens, "brand.colors.primary");
      expect(result?.type).toBe("color");
      expect(result?.inheritedFrom).toBe("brand");
    });

    it("should prefer closest parent", () => {
      const tokens = {
        brand: {
          $type: "dimension",
          colors: {
            $type: "color",
            primary: { $value: "#ff0000" },
          },
        },
      };

      const result = getInheritedType(tokens, "brand.colors.primary");
      expect(result?.type).toBe("color");
      expect(result?.inheritedFrom).toBe("brand.colors");
    });

    it("should return undefined if no parent has $type", () => {
      const tokens = {
        colors: {
          primary: { $value: "#ff0000" },
        },
      };

      const result = getInheritedType(tokens, "colors.primary");
      expect(result).toBeUndefined();
    });

    it("should handle root level $type", () => {
      const tokens = {
        $type: "color",
        primary: { $value: "#ff0000" },
      };

      const result = getInheritedType(tokens, "primary");
      expect(result?.type).toBe("color");
      expect(result?.inheritedFrom).toBe("$root");
    });
  });

  describe("getReferencedType", () => {
    it("should get type from alias reference", () => {
      const tokens = {
        colors: {
          primary: { $type: "color", $value: "#ff0000" },
        },
      };

      const result = getReferencedType(tokens, "{colors.primary}");
      expect(result?.type).toBe("color");
      expect(result?.referencedPath).toBe("colors.primary");
    });

    it("should get type from $ref reference", () => {
      const tokens = {
        colors: {
          primary: { $type: "color", $value: "#ff0000" },
        },
      };

      const result = getReferencedType(tokens, { $ref: "#/colors/primary" });
      expect(result?.type).toBe("color");
    });

    it("should follow chained references", () => {
      const tokens = {
        colors: {
          base: { $type: "color", $value: "#ff0000" },
          primary: { $value: "{colors.base}" },
        },
      };

      const result = getReferencedType(tokens, "{colors.primary}");
      expect(result?.type).toBe("color");
    });

    it("should return undefined for non-reference", () => {
      const tokens = {};
      const result = getReferencedType(tokens, "#ff0000");
      expect(result).toBeUndefined();
    });

    it("should detect circular references", () => {
      const tokens = {
        a: { $value: "{b}" },
        b: { $value: "{a}" },
      };

      const result = getReferencedType(tokens, "{a}");
      expect(result).toBeUndefined();
    });
  });

  describe("inferTokenType", () => {
    it("should prefer explicit type (priority 1)", () => {
      const tokens = {
        colors: {
          $type: "dimension", // group type (would be inherited)
          primary: { $type: "color", $value: "#ff0000" }, // explicit type
        },
      };

      const result = inferTokenType(tokens, "colors.primary");
      expect(result.type).toBe("color");
      expect(result.source).toBe("explicit");
    });

    it("should use reference type (priority 2)", () => {
      const tokens = {
        colors: {
          base: { $type: "color", $value: "#ff0000" },
          primary: { $value: "{colors.base}" },
        },
      };

      const result = inferTokenType(tokens, "colors.primary");
      expect(result.type).toBe("color");
      expect(result.source).toBe("reference");
      expect(result.referencedPath).toBe("colors.base");
    });

    it("should use inherited type (priority 3)", () => {
      const tokens = {
        colors: {
          $type: "color",
          primary: { $value: "#ff0000" },
        },
      };

      const result = inferTokenType(tokens, "colors.primary");
      expect(result.type).toBe("color");
      expect(result.source).toBe("inherited");
      expect(result.inheritedFrom).toBe("colors");
    });

    it("should return none if cannot infer", () => {
      const tokens = {
        colors: {
          primary: { $value: "#ff0000" },
        },
      };

      const result = inferTokenType(tokens, "colors.primary");
      expect(result.source).toBe("none");
      expect(result.type).toBeUndefined();
    });

    it("should return none for non-existent path", () => {
      const tokens = {};
      const result = inferTokenType(tokens, "nonexistent");
      expect(result.source).toBe("none");
    });
  });

  describe("inferAllTypes", () => {
    it("should infer types for all tokens", () => {
      const tokens = {
        colors: {
          $type: "color",
          primary: { $value: "#ff0000" },
          secondary: { $value: "#00ff00" },
        },
        spacing: {
          sm: { $type: "dimension", $value: "8px" },
        },
      };

      const results = inferAllTypes(tokens);

      expect(results.has("colors.primary")).toBe(true);
      expect(results.has("colors.secondary")).toBe(true);
      expect(results.has("spacing.sm")).toBe(true);
      expect(results.get("colors.primary")?.type).toBe("color");
      expect(results.get("spacing.sm")?.type).toBe("dimension");
    });

    it("should skip non-token entries", () => {
      const tokens = {
        colors: {
          $type: "color",
          $description: "Color tokens", // not a token
          primary: { $value: "#ff0000" },
        },
      };

      const results = inferAllTypes(tokens);

      expect(results.has("colors.$description")).toBe(false);
      expect(results.has("colors.primary")).toBe(true);
    });
  });

  describe("findUntyped", () => {
    it("should find tokens without resolvable types", () => {
      const tokens = {
        colors: {
          primary: { $value: "#ff0000" }, // no type
        },
      };

      const errors = findUntyped(tokens);

      expect(errors.length).toBe(1);
      expect(errors[0].path).toBe("colors.primary");
    });

    it("should return empty for all typed tokens", () => {
      const tokens = {
        colors: {
          $type: "color",
          primary: { $value: "#ff0000" },
        },
      };

      const errors = findUntyped(tokens);

      expect(errors).toHaveLength(0);
    });
  });

  describe("applyInferredTypes", () => {
    it("should add $type to tokens without explicit type", () => {
      const tokens = {
        colors: {
          $type: "color",
          primary: { $value: "#ff0000" },
        },
      };

      applyInferredTypes(tokens);

      expect((tokens.colors.primary as any).$type).toBe("color");
    });

    it("should not override explicit types", () => {
      const tokens = {
        colors: {
          $type: "dimension",
          primary: { $type: "color", $value: "#ff0000" },
        },
      };

      applyInferredTypes(tokens);

      expect((tokens.colors.primary as any).$type).toBe("color");
    });
  });

  describe("resolveAllTypes", () => {
    it("should return new object with types resolved", () => {
      const tokens = {
        colors: {
          $type: "color",
          primary: { $value: "#ff0000" },
        },
      };

      const resolved = resolveAllTypes(tokens);

      expect((resolved.colors as any).primary.$type).toBe("color");
      // Original should be unchanged
      expect((tokens.colors.primary as any).$type).toBeUndefined();
    });
  });

  describe("allTypesResolvable", () => {
    it("should return true when all types can be resolved", () => {
      const tokens = {
        colors: {
          $type: "color",
          primary: { $value: "#ff0000" },
        },
      };

      expect(allTypesResolvable(tokens)).toBe(true);
    });

    it("should return false when some types cannot be resolved", () => {
      const tokens = {
        colors: {
          primary: { $value: "#ff0000" }, // no type
        },
      };

      expect(allTypesResolvable(tokens)).toBe(false);
    });
  });

  describe("getTypeInheritanceChain", () => {
    it("should return inheritance chain", () => {
      const tokens = {
        $type: "dimension",
        brand: {
          $type: "color",
          colors: {
            primary: { $value: "#ff0000" },
          },
        },
      };

      const chain = getTypeInheritanceChain(tokens, "brand.colors.primary");

      expect(chain).toContain("$root: dimension");
      expect(chain).toContain("brand: color");
    });

    it("should return empty for no types in chain", () => {
      const tokens = {
        colors: {
          primary: { $value: "#ff0000" },
        },
      };

      const chain = getTypeInheritanceChain(tokens, "colors.primary");

      expect(chain).toHaveLength(0);
    });
  });

  describe("validateTypeConsistency", () => {
    it("should pass for consistent types", () => {
      const tokens = {
        colors: {
          $type: "color",
          base: { $value: "#ff0000" },
          primary: { $value: "{colors.base}" },
        },
      };

      const errors = validateTypeConsistency(tokens);

      expect(errors).toHaveLength(0);
    });

    it("should detect type mismatches with explicit types", () => {
      const tokens = {
        colors: {
          base: { $type: "color", $value: "#ff0000" },
          mismatch: { $type: "dimension", $value: "{colors.base}" }, // mismatch
        },
      };

      const errors = validateTypeConsistency(tokens);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toContain("Type mismatch");
    });
  });
});
