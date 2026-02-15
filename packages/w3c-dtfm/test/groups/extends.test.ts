/**
 * $extends Tests
 *
 * Tests for W3C group inheritance with deep merge.
 */
import { describe, expect, it } from "bun:test";
import {
  hasExtends,
  getExtendsTarget,
  resolveExtends,
  resolveAllExtends,
  hasAnyExtends,
  collectAllExtends,
  detectCircularExtends,
} from "../../src/groups/extends";

describe("Group $extends", () => {
  describe("hasExtends", () => {
    it("should return true for group with $extends alias", () => {
      const group = {
        $extends: "{base.colors}",
        primary: { $value: "#ff0000" },
      };
      expect(hasExtends(group)).toBe(true);
    });

    it("should return true for group with $extends $ref", () => {
      const group = {
        $extends: { $ref: "#/base/colors" },
        primary: { $value: "#ff0000" },
      };
      expect(hasExtends(group)).toBe(true);
    });

    it("should return false for group without $extends", () => {
      const group = {
        primary: { $value: "#ff0000" },
      };
      expect(hasExtends(group)).toBe(false);
    });

    it("should return false for invalid $extends value", () => {
      const group = {
        $extends: "not-a-reference",
        primary: { $value: "#ff0000" },
      };
      expect(hasExtends(group)).toBe(false);
    });
  });

  describe("getExtendsTarget", () => {
    it("should return target path from alias", () => {
      const group = {
        $extends: "{base.colors}",
      };
      expect(getExtendsTarget(group)).toBe("base.colors");
    });

    it("should return target path from $ref", () => {
      const group = {
        $extends: { $ref: "#/base/colors" },
      };
      expect(getExtendsTarget(group)).toBe("base.colors");
    });

    it("should return null for group without $extends", () => {
      const group = {
        primary: { $value: "#ff0000" },
      };
      expect(getExtendsTarget(group)).toBeNull();
    });
  });

  describe("resolveExtends", () => {
    it("should merge base group into extending group", () => {
      const tokens = {
        base: {
          colors: {
            primary: { $value: "#ff0000" },
            secondary: { $value: "#00ff00" },
          },
        },
        theme: {
          colors: {
            $extends: "{base.colors}",
            secondary: { $value: "#0000ff" }, // Override
          },
        },
      };

      const result = resolveExtends(
        tokens.theme.colors as any,
        tokens,
        "theme.colors"
      );

      expect(result.errors).toHaveLength(0);
      expect(result.resolved.primary).toEqual({ $value: "#ff0000" });
      expect(result.resolved.secondary).toEqual({ $value: "#0000ff" }); // Overridden
    });

    it("should report error for missing target", () => {
      const tokens = {
        theme: {
          colors: {
            $extends: "{nonexistent.colors}",
          },
        },
      };

      const result = resolveExtends(
        tokens.theme.colors as any,
        tokens,
        "theme.colors"
      );

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].code).toBe("MISSING_EXTENDS_TARGET");
    });

    it("should detect circular $extends", () => {
      const tokens = {
        a: {
          $extends: "{b}",
        },
        b: {
          $extends: "{a}",
        },
      };

      const result = resolveExtends(tokens.a as any, tokens, "a");

      expect(result.errors.some((e) => e.code === "CIRCULAR_EXTENDS")).toBe(true);
    });

    it("should resolve chained $extends", () => {
      const tokens = {
        base: {
          primary: { $value: "#ff0000" },
        },
        intermediate: {
          $extends: "{base}",
          secondary: { $value: "#00ff00" },
        },
        final: {
          $extends: "{intermediate}",
          tertiary: { $value: "#0000ff" },
        },
      };

      const result = resolveExtends(tokens.final as any, tokens, "final");

      expect(result.errors).toHaveLength(0);
      expect(result.resolved.primary).toEqual({ $value: "#ff0000" });
      expect(result.resolved.secondary).toEqual({ $value: "#00ff00" });
      expect(result.resolved.tertiary).toEqual({ $value: "#0000ff" });
    });

    it("should return unchanged if no $extends", () => {
      const tokens = {
        colors: {
          primary: { $value: "#ff0000" },
        },
      };

      const result = resolveExtends(
        tokens.colors as any,
        tokens,
        "colors"
      );

      expect(result.errors).toHaveLength(0);
      expect(result.resolved).toEqual(tokens.colors);
    });
  });

  describe("resolveAllExtends", () => {
    it("should resolve all $extends in tokens", () => {
      const tokens = {
        base: {
          colors: {
            primary: { $value: "#ff0000" },
          },
        },
        theme1: {
          colors: {
            $extends: "{base.colors}",
            secondary: { $value: "#00ff00" },
          },
        },
        theme2: {
          colors: {
            $extends: "{base.colors}",
            secondary: { $value: "#0000ff" },
          },
        },
      };

      const result = resolveAllExtends(tokens);

      expect(result.errors).toHaveLength(0);
      expect((result.resolved as any).theme1.colors.primary).toEqual({ $value: "#ff0000" });
      expect((result.resolved as any).theme2.colors.primary).toEqual({ $value: "#ff0000" });
    });

    it("should preserve non-extending groups", () => {
      const tokens = {
        colors: {
          primary: { $value: "#ff0000" },
        },
      };

      const result = resolveAllExtends(tokens);

      expect(result.resolved).toEqual(tokens);
    });

    it("should collect all errors", () => {
      const tokens = {
        a: {
          $extends: "{nonexistent1}",
        },
        b: {
          $extends: "{nonexistent2}",
        },
      };

      const result = resolveAllExtends(tokens);

      expect(result.errors.length).toBe(2);
    });
  });

  describe("hasAnyExtends", () => {
    it("should return true if any group has $extends", () => {
      const tokens = {
        base: {
          primary: { $value: "#ff0000" },
        },
        theme: {
          $extends: "{base}",
        },
      };

      expect(hasAnyExtends(tokens)).toBe(true);
    });

    it("should return true for nested $extends", () => {
      const tokens = {
        themes: {
          light: {
            colors: {
              $extends: "{base.colors}",
            },
          },
        },
      };

      expect(hasAnyExtends(tokens)).toBe(true);
    });

    it("should return false if no $extends", () => {
      const tokens = {
        colors: {
          primary: { $value: "#ff0000" },
        },
      };

      expect(hasAnyExtends(tokens)).toBe(false);
    });
  });

  describe("collectAllExtends", () => {
    it("should collect all $extends references", () => {
      const tokens = {
        base: {
          colors: { primary: { $value: "#ff0000" } },
        },
        theme1: {
          colors: { $extends: "{base.colors}" },
        },
        theme2: {
          colors: { $extends: "{base.colors}" },
        },
      };

      const extends_ = collectAllExtends(tokens);

      expect(extends_.size).toBe(2);
      expect(extends_.get("theme1.colors")).toBe("base.colors");
      expect(extends_.get("theme2.colors")).toBe("base.colors");
    });

    it("should return empty map if no $extends", () => {
      const tokens = {
        colors: {
          primary: { $value: "#ff0000" },
        },
      };

      const extends_ = collectAllExtends(tokens);

      expect(extends_.size).toBe(0);
    });
  });

  describe("detectCircularExtends", () => {
    it("should detect direct circular reference", () => {
      const tokens = {
        a: { $extends: "{b}" },
        b: { $extends: "{a}" },
      };

      const cycles = detectCircularExtends(tokens);

      expect(cycles.length).toBeGreaterThan(0);
    });

    it("should detect indirect circular reference", () => {
      const tokens = {
        a: { $extends: "{b}" },
        b: { $extends: "{c}" },
        c: { $extends: "{a}" },
      };

      const cycles = detectCircularExtends(tokens);

      expect(cycles.length).toBeGreaterThan(0);
    });

    it("should return empty for no cycles", () => {
      const tokens = {
        base: { primary: { $value: "#ff0000" } },
        theme: { $extends: "{base}" },
      };

      const cycles = detectCircularExtends(tokens);

      expect(cycles).toHaveLength(0);
    });

    it("should return empty for no $extends", () => {
      const tokens = {
        colors: {
          primary: { $value: "#ff0000" },
        },
      };

      const cycles = detectCircularExtends(tokens);

      expect(cycles).toHaveLength(0);
    });
  });
});
