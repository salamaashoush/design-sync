/**
 * Migration Tests
 *
 * Tests for migrating tokens between formats.
 */
import { describe, expect, it } from "bun:test";
import {
  migrateTokens,
  needsMigration,
  generateMigrationReport,
  validateMigration,
} from "../../src/format/migrate";

describe("Token Migration", () => {
  describe("migrateTokens", () => {
    it("should migrate legacy colors to W3C format", () => {
      const tokens = {
        colors: {
          primary: {
            $type: "color",
            $value: "#ff0000",
          },
        },
      };

      const result = migrateTokens(tokens, { targetFormat: "w3c" });

      expect(result.targetFormat).toBe("w3c");
      expect(result.stats.valuesConverted).toBeGreaterThan(0);
      const migratedColor = (result.tokens as any).colors.primary.$value;
      expect(migratedColor).toHaveProperty("colorSpace");
      expect(migratedColor).toHaveProperty("components");
    });

    it("should migrate legacy dimensions to W3C format", () => {
      const tokens = {
        spacing: {
          md: {
            $type: "dimension",
            $value: "16px",
          },
        },
      };

      const result = migrateTokens(tokens, { targetFormat: "w3c" });

      const migratedDim = (result.tokens as any).spacing.md.$value;
      expect(migratedDim).toEqual({ value: 16, unit: "px" });
    });

    it("should migrate legacy durations to W3C format", () => {
      const tokens = {
        animation: {
          duration: {
            $type: "duration",
            $value: "500ms",
          },
        },
      };

      const result = migrateTokens(tokens, { targetFormat: "w3c" });

      const migratedDur = (result.tokens as any).animation.duration.$value;
      expect(migratedDur).toEqual({ value: 500, unit: "ms" });
    });

    it("should convert aliases to $ref when option enabled", () => {
      const tokens = {
        colors: {
          primary: {
            $type: "color",
            $value: "#ff0000",
          },
          alias: {
            $type: "color",
            $value: "{colors.primary}",
          },
        },
      };

      const result = migrateTokens(tokens, {
        targetFormat: "w3c",
        convertAliasesToRefs: true,
      });

      const migratedAlias = (result.tokens as any).colors.alias.$value;
      expect(migratedAlias).toHaveProperty("$ref");
      expect(migratedAlias.$ref).toBe("#/colors/primary");
    });

    it("should preserve metadata during migration", () => {
      const tokens = {
        colors: {
          primary: {
            $type: "color",
            $value: "#ff0000",
            $description: "Primary brand color",
            $deprecated: true,
          },
        },
      };

      const result = migrateTokens(tokens, { targetFormat: "w3c" });

      const migratedToken = (result.tokens as any).colors.primary;
      expect(migratedToken.$description).toBe("Primary brand color");
      expect(migratedToken.$deprecated).toBe(true);
      expect(migratedToken.$type).toBe("color");
    });

    it("should return unchanged if already in target format", () => {
      const tokens = {
        colors: {
          primary: {
            $type: "color",
            $value: {
              colorSpace: "srgb",
              components: [1, 0, 0],
            },
          },
        },
      };

      const result = migrateTokens(tokens, { targetFormat: "w3c" });

      expect(result.warnings.some((w) => w.message.includes("already in"))).toBe(true);
    });

    it("should migrate W3C to legacy format", () => {
      const tokens = {
        colors: {
          primary: {
            $type: "color",
            $value: {
              colorSpace: "srgb",
              components: [1, 0, 0],
            },
          },
        },
      };

      const result = migrateTokens(tokens, { targetFormat: "legacy" });

      expect(result.targetFormat).toBe("legacy");
      expect(result.warnings.some((w) => w.message.includes("not recommended"))).toBe(true);
    });

    it("should track statistics", () => {
      const tokens = {
        colors: {
          primary: { $type: "color", $value: "#ff0000" },
          secondary: { $type: "color", $value: "#00ff00" },
        },
        spacing: {
          sm: { $type: "dimension", $value: "8px" },
          md: { $type: "dimension", $value: "16px" },
        },
      };

      const result = migrateTokens(tokens, { targetFormat: "w3c" });

      expect(result.stats.tokensProcessed).toBeGreaterThan(0);
      expect(result.stats.valuesConverted).toBeGreaterThan(0);
      expect(result.stats.errorsEncountered).toBe(0);
    });

    it("should handle nested token groups", () => {
      const tokens = {
        brand: {
          colors: {
            $type: "color",
            primary: { $value: "#ff0000" },
            secondary: { $value: "#00ff00" },
          },
        },
      };

      const result = migrateTokens(tokens, { targetFormat: "w3c" });

      const primary = (result.tokens as any).brand.colors.primary.$value;
      expect(primary).toHaveProperty("colorSpace");
    });
  });

  describe("needsMigration", () => {
    it("should return true for legacy format needing W3C migration", () => {
      const tokens = {
        colors: {
          primary: { $type: "color", $value: "#ff0000" },
        },
      };

      expect(needsMigration(tokens, "w3c")).toBe(true);
    });

    it("should return true for mixed format needing W3C migration", () => {
      const tokens = {
        colors: {
          primary: { $type: "color", $value: "#ff0000" },
          secondary: {
            $type: "color",
            $value: { colorSpace: "srgb", components: [0, 1, 0] },
          },
        },
      };

      expect(needsMigration(tokens, "w3c")).toBe(true);
    });

    it("should return false for W3C format not needing migration", () => {
      const tokens = {
        colors: {
          primary: {
            $type: "color",
            $value: { colorSpace: "srgb", components: [1, 0, 0] },
          },
        },
      };

      expect(needsMigration(tokens, "w3c")).toBe(false);
    });

    it("should return false for unknown format", () => {
      expect(needsMigration({}, "w3c")).toBe(false);
    });

    it("should return true for W3C format needing legacy migration", () => {
      const tokens = {
        colors: {
          primary: {
            $type: "color",
            $value: { colorSpace: "srgb", components: [1, 0, 0] },
          },
        },
      };

      expect(needsMigration(tokens, "legacy")).toBe(true);
    });
  });

  describe("generateMigrationReport", () => {
    it("should analyze token format", () => {
      const tokens = {
        colors: {
          primary: { $type: "color", $value: "#ff0000" },
        },
      };

      const report = generateMigrationReport(tokens);

      expect(report.analysis.format).toBe("legacy");
    });

    it("should provide recommendations for legacy format", () => {
      const tokens = {
        colors: {
          primary: { $type: "color", $value: "#ff0000" },
        },
      };

      const report = generateMigrationReport(tokens);

      expect(report.recommendations.length).toBeGreaterThan(0);
      expect(report.recommendations.some((r) => r.includes("migrated"))).toBe(true);
    });

    it("should estimate changes for colors", () => {
      const tokens = {
        colors: {
          primary: { $type: "color", $value: "#ff0000" },
          secondary: { $type: "color", $value: "#00ff00" },
        },
      };

      const report = generateMigrationReport(tokens);

      expect(report.estimatedChanges.colors).toBeGreaterThanOrEqual(2);
    });

    it("should estimate changes for dimensions", () => {
      const tokens = {
        spacing: {
          sm: { $type: "dimension", $value: "8px" },
          md: { $type: "dimension", $value: "16px" },
        },
      };

      const report = generateMigrationReport(tokens);

      expect(report.estimatedChanges.dimensions).toBeGreaterThanOrEqual(2);
    });

    it("should estimate changes for durations", () => {
      const tokens = {
        animation: {
          fast: { $type: "duration", $value: "100ms" },
          slow: { $type: "duration", $value: "500ms" },
        },
      };

      const report = generateMigrationReport(tokens);

      expect(report.estimatedChanges.durations).toBeGreaterThanOrEqual(2);
    });

    it("should provide recommendation for W3C format", () => {
      const tokens = {
        colors: {
          primary: {
            $type: "color",
            $value: { colorSpace: "srgb", components: [1, 0, 0] },
          },
        },
      };

      const report = generateMigrationReport(tokens);

      expect(report.recommendations.some((r) => r.includes("No migration needed"))).toBe(true);
    });
  });

  describe("validateMigration", () => {
    it("should validate successful migration", () => {
      const original = {
        colors: {
          primary: { $type: "color", $value: "#ff0000" },
        },
      };

      const migrated = {
        colors: {
          primary: {
            $type: "color",
            $value: { colorSpace: "srgb", components: [1, 0, 0] },
          },
        },
      };

      const result = validateMigration(original, migrated);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect array length mismatches", () => {
      const original = {
        items: [1, 2, 3],
      };

      const migrated = {
        items: [1, 2],
      };

      const result = validateMigration(original, migrated);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes("length mismatch"))).toBe(true);
    });

    it("should handle nested objects", () => {
      const original = {
        theme: {
          colors: {
            primary: "#ff0000",
          },
        },
      };

      const migrated = {
        theme: {
          colors: {
            primary: { colorSpace: "srgb", components: [1, 0, 0] },
          },
        },
      };

      const result = validateMigration(original, migrated);

      expect(result.isValid).toBe(true);
    });
  });
});
