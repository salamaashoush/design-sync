/**
 * Resolver Stages Tests
 *
 * Tests for the 4-stage W3C resolver algorithm.
 */
import { describe, expect, it } from "bun:test";
import {
  stage1Validate,
  stage2BuildDependencyGraph,
  topologicalSort,
  stage3ResolveAliases,
  runResolver,
} from "../../src/resolver/stages";

describe("Resolver Stages", () => {
  describe("stage1Validate", () => {
    it("should return valid for valid tokens", () => {
      const tokens = {
        colors: {
          primary: { $type: "color", $value: "#ff0000" },
        },
      };

      const result = stage1Validate(tokens);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return errors for invalid tokens", () => {
      const tokens = {
        colors: {
          "invalid{name}": { $type: "color", $value: "#ff0000" },
        },
      };

      const result = stage1Validate(tokens);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe("stage2BuildDependencyGraph", () => {
    it("should build graph for tokens without references", () => {
      const tokens = {
        colors: {
          primary: { $type: "color", $value: "#ff0000" },
          secondary: { $type: "color", $value: "#00ff00" },
        },
      };

      const graph = stage2BuildDependencyGraph(tokens);

      expect(graph.has("colors.primary")).toBe(true);
      expect(graph.has("colors.secondary")).toBe(true);
      expect(graph.get("colors.primary")?.dependencies).toHaveLength(0);
    });

    it("should detect dependencies from aliases", () => {
      const tokens = {
        colors: {
          primary: { $type: "color", $value: "#ff0000" },
          alias: { $type: "color", $value: "{colors.primary}" },
        },
      };

      const graph = stage2BuildDependencyGraph(tokens);

      expect(graph.get("colors.alias")?.dependencies).toContain("colors.primary");
    });

    it("should detect dependencies from $ref", () => {
      const tokens = {
        colors: {
          primary: {
            $type: "color",
            $value: { colorSpace: "srgb", components: [1, 0, 0] },
          },
          alias: { $type: "color", $value: { $ref: "#/colors/primary" } },
        },
      };

      const graph = stage2BuildDependencyGraph(tokens);

      expect(graph.get("colors.alias")?.dependencies).toContain("colors.primary");
    });

    it("should build reverse dependencies", () => {
      const tokens = {
        colors: {
          primary: { $type: "color", $value: "#ff0000" },
          alias: { $type: "color", $value: "{colors.primary}" },
        },
      };

      const graph = stage2BuildDependencyGraph(tokens);

      expect(graph.get("colors.primary")?.dependents).toContain("colors.alias");
    });

    it("should handle chained references", () => {
      const tokens = {
        colors: {
          primary: { $type: "color", $value: "#ff0000" },
          secondary: { $type: "color", $value: "{colors.primary}" },
          tertiary: { $type: "color", $value: "{colors.secondary}" },
        },
      };

      const graph = stage2BuildDependencyGraph(tokens);

      expect(graph.get("colors.secondary")?.dependencies).toContain("colors.primary");
      expect(graph.get("colors.tertiary")?.dependencies).toContain("colors.secondary");
    });
  });

  describe("topologicalSort", () => {
    it("should sort independent tokens in any order", () => {
      const tokens = {
        colors: {
          red: { $type: "color", $value: "#ff0000" },
          green: { $type: "color", $value: "#00ff00" },
          blue: { $type: "color", $value: "#0000ff" },
        },
      };

      const graph = stage2BuildDependencyGraph(tokens);
      const { order, cycles } = topologicalSort(graph);

      expect(order).toHaveLength(3);
      expect(cycles).toHaveLength(0);
    });

    it("should put dependencies before dependents", () => {
      const tokens = {
        colors: {
          primary: { $type: "color", $value: "#ff0000" },
          alias: { $type: "color", $value: "{colors.primary}" },
        },
      };

      const graph = stage2BuildDependencyGraph(tokens);
      const { order, cycles } = topologicalSort(graph);

      const primaryIndex = order.indexOf("colors.primary");
      const aliasIndex = order.indexOf("colors.alias");

      expect(primaryIndex).toBeLessThan(aliasIndex);
      expect(cycles).toHaveLength(0);
    });

    it("should handle chained dependencies", () => {
      const tokens = {
        colors: {
          a: { $type: "color", $value: "#ff0000" },
          b: { $type: "color", $value: "{colors.a}" },
          c: { $type: "color", $value: "{colors.b}" },
        },
      };

      const graph = stage2BuildDependencyGraph(tokens);
      const { order, cycles } = topologicalSort(graph);

      const aIndex = order.indexOf("colors.a");
      const bIndex = order.indexOf("colors.b");
      const cIndex = order.indexOf("colors.c");

      expect(aIndex).toBeLessThan(bIndex);
      expect(bIndex).toBeLessThan(cIndex);
      expect(cycles).toHaveLength(0);
    });

    it("should detect circular references", () => {
      const tokens = {
        colors: {
          a: { $type: "color", $value: "{colors.b}" },
          b: { $type: "color", $value: "{colors.a}" },
        },
      };

      const graph = stage2BuildDependencyGraph(tokens);
      const { cycles } = topologicalSort(graph);

      expect(cycles.length).toBeGreaterThan(0);
    });

    it("should detect longer circular chains", () => {
      const tokens = {
        colors: {
          a: { $type: "color", $value: "{colors.c}" },
          b: { $type: "color", $value: "{colors.a}" },
          c: { $type: "color", $value: "{colors.b}" },
        },
      };

      const graph = stage2BuildDependencyGraph(tokens);
      const { cycles } = topologicalSort(graph);

      expect(cycles.length).toBeGreaterThan(0);
    });
  });

  describe("stage3ResolveAliases", () => {
    it("should resolve simple alias", () => {
      const tokens = {
        colors: {
          primary: { $type: "color", $value: "#ff0000" },
          alias: { $type: "color", $value: "{colors.primary}" },
        },
      };

      const graph = stage2BuildDependencyGraph(tokens);
      const { order } = topologicalSort(graph);
      const { errors } = stage3ResolveAliases(tokens, graph, order);

      expect(errors).toHaveLength(0);
      expect(graph.get("colors.alias")?.resolvedValue).toBe("#ff0000");
    });

    it("should resolve chained aliases", () => {
      const tokens = {
        colors: {
          a: { $type: "color", $value: "#ff0000" },
          b: { $type: "color", $value: "{colors.a}" },
          c: { $type: "color", $value: "{colors.b}" },
        },
      };

      const graph = stage2BuildDependencyGraph(tokens);
      const { order } = topologicalSort(graph);
      const { errors } = stage3ResolveAliases(tokens, graph, order);

      expect(errors).toHaveLength(0);
      expect(graph.get("colors.c")?.resolvedValue).toBe("#ff0000");
    });

    it("should resolve references in composite values", () => {
      const tokens = {
        colors: {
          black: { $type: "color", $value: "#000000" },
        },
        shadows: {
          sm: {
            $type: "shadow",
            $value: {
              color: "{colors.black}",
              offsetX: "0px",
              offsetY: "2px",
              blur: "4px",
              spread: "0px",
            },
          },
        },
      };

      const graph = stage2BuildDependencyGraph(tokens);
      const { order } = topologicalSort(graph);
      const { errors } = stage3ResolveAliases(tokens, graph, order);

      expect(errors).toHaveLength(0);
      const resolved = graph.get("shadows.sm")?.resolvedValue as any;
      expect(resolved.color).toBe("#000000");
    });

    it("should report missing reference errors", () => {
      const tokens = {
        colors: {
          alias: { $type: "color", $value: "{colors.nonexistent}" },
        },
      };

      const graph = stage2BuildDependencyGraph(tokens);
      const { order } = topologicalSort(graph);
      const { errors } = stage3ResolveAliases(tokens, graph, order);

      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("runResolver", () => {
    it("should resolve all tokens successfully", () => {
      const tokens = {
        colors: {
          primary: { $type: "color", $value: "#ff0000" },
          alias: { $type: "color", $value: "{colors.primary}" },
        },
      };

      const result = runResolver(tokens);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should fail for circular references", () => {
      const tokens = {
        colors: {
          a: { $type: "color", $value: "{colors.b}" },
          b: { $type: "color", $value: "{colors.a}" },
        },
      };

      const result = runResolver(tokens);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should fail for missing references", () => {
      const tokens = {
        colors: {
          alias: { $type: "color", $value: "{colors.nonexistent}" },
        },
      };

      const result = runResolver(tokens);

      expect(result.success).toBe(false);
    });

    it("should skip validation when disabled", () => {
      const tokens = {
        colors: {
          primary: { $type: "color", $value: "#ff0000" },
        },
      };

      const result = runResolver(tokens, { validateInput: false });

      expect(result.success).toBe(true);
    });

    it("should throw on error when option enabled", () => {
      const tokens = {
        colors: {
          a: { $type: "color", $value: "{colors.b}" },
          b: { $type: "color", $value: "{colors.a}" },
        },
      };

      expect(() => {
        runResolver(tokens, { throwOnError: true });
      }).toThrow();
    });
  });
});
