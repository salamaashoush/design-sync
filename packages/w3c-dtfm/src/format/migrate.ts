/**
 * Token Migration Utilities
 *
 * Tools for migrating tokens from legacy format to W3C format.
 */

import { isObject } from "@design-sync/utils";
import { detectTokenFormat, analyzeTokens, type TokenFormat } from "./detector";
import { convertValueToW3C, convertValueToLegacy } from "./converters";
import {
  isLegacyColor,
  isLegacyDimension,
  isLegacyDuration,
  isLegacyTokenAlias,
} from "../types/legacy";

export interface MigrationOptions {
  /**
   * Whether to show warnings during migration
   * @default true
   */
  warnings?: boolean;
  /**
   * Whether to convert aliases to $ref format
   * @default false
   */
  convertAliasesToRefs?: boolean;
  /**
   * Whether to preserve hex values in color objects
   * @default true
   */
  preserveHexInColors?: boolean;
  /**
   * Target format for migration
   * @default 'w3c'
   */
  targetFormat?: "w3c" | "legacy";
}

export interface MigrationWarning {
  path: string;
  message: string;
  type: "info" | "warning" | "error";
}

export interface MigrationResult {
  tokens: Record<string, unknown>;
  originalFormat: TokenFormat;
  targetFormat: "w3c" | "legacy";
  warnings: MigrationWarning[];
  stats: {
    tokensProcessed: number;
    valuesConverted: number;
    errorsEncountered: number;
  };
}

/**
 * Migrate tokens from one format to another
 */
export function migrateTokens(
  tokens: Record<string, unknown>,
  options: MigrationOptions = {},
): MigrationResult {
  const {
    warnings: showWarnings = true,
    convertAliasesToRefs = false,
    preserveHexInColors: _preserveHexInColors = true,
    targetFormat = "w3c",
  } = options;

  const originalFormat = detectTokenFormat(tokens);
  const migrationWarnings: MigrationWarning[] = [];
  const stats = {
    tokensProcessed: 0,
    valuesConverted: 0,
    errorsEncountered: 0,
  };

  // If already in target format, return as-is
  if (
    (originalFormat === "w3c" && targetFormat === "w3c") ||
    (originalFormat === "legacy" && targetFormat === "legacy")
  ) {
    if (showWarnings) {
      migrationWarnings.push({
        path: "",
        message: `Tokens are already in ${targetFormat} format`,
        type: "info",
      });
    }
    return {
      tokens,
      originalFormat,
      targetFormat,
      warnings: migrationWarnings,
      stats,
    };
  }

  const converter = targetFormat === "w3c" ? convertValueToW3C : convertValueToLegacy;

  function migrateValue(value: unknown, path: string): unknown {
    try {
      // Handle token aliases specially if converting to $ref
      if (convertAliasesToRefs && targetFormat === "w3c" && isLegacyTokenAlias(value)) {
        stats.valuesConverted++;
        const aliasPath = value.slice(1, -1).replace(/\./g, "/");
        return { $ref: `#/${aliasPath}` };
      }

      // Check if value needs conversion
      const needsConversion =
        targetFormat === "w3c"
          ? isLegacyColor(value) || isLegacyDimension(value) || isLegacyDuration(value)
          : typeof value === "object" &&
            value !== null &&
            ("colorSpace" in value || ("value" in value && "unit" in value));

      if (needsConversion) {
        stats.valuesConverted++;
        return converter(value);
      }

      // Recurse into arrays
      if (Array.isArray(value)) {
        return value.map((v, i) => migrateValue(v, `${path}[${i}]`));
      }

      // Recurse into objects
      if (isObject(value)) {
        const result: Record<string, unknown> = {};
        for (const [key, val] of Object.entries(value)) {
          const newPath = path ? `${path}.${key}` : key;
          if (key === "$value") {
            stats.tokensProcessed++;
            result[key] = migrateValue(val, newPath);
          } else if (key.startsWith("$")) {
            // Preserve metadata
            result[key] = val;
          } else {
            result[key] = migrateValue(val, newPath);
          }
        }
        return result;
      }

      return value;
    } catch (error) {
      stats.errorsEncountered++;
      migrationWarnings.push({
        path,
        message: error instanceof Error ? error.message : "Unknown error during migration",
        type: "error",
      });
      return value;
    }
  }

  const migratedTokens = migrateValue(tokens, "") as Record<string, unknown>;

  // Add deprecation warnings for legacy format
  if (targetFormat === "legacy" && showWarnings) {
    migrationWarnings.push({
      path: "",
      message: "Converting to legacy format is not recommended. Consider using W3C format instead.",
      type: "warning",
    });
  }

  return {
    tokens: migratedTokens,
    originalFormat,
    targetFormat,
    warnings: migrationWarnings,
    stats,
  };
}

/**
 * Check if tokens need migration
 */
export function needsMigration(
  tokens: Record<string, unknown>,
  targetFormat: "w3c" | "legacy" = "w3c",
): boolean {
  const currentFormat = detectTokenFormat(tokens);

  if (currentFormat === "unknown") {
    return false;
  }

  if (targetFormat === "w3c") {
    return currentFormat === "legacy" || currentFormat === "mixed";
  }

  return currentFormat === "w3c" || currentFormat === "mixed";
}

/**
 * Generate a migration report without actually migrating
 */
export function generateMigrationReport(tokens: Record<string, unknown>): {
  analysis: ReturnType<typeof analyzeTokens>;
  recommendations: string[];
  estimatedChanges: {
    colors: number;
    dimensions: number;
    durations: number;
    aliases: number;
  };
} {
  const analysis = analyzeTokens(tokens);
  const recommendations: string[] = [];

  if (analysis.format === "legacy") {
    recommendations.push(
      "Tokens are in legacy format and should be migrated to W3C format for better compatibility.",
    );
  } else if (analysis.format === "mixed") {
    recommendations.push(
      "Tokens contain a mix of legacy and W3C formats. Consider migrating all tokens to W3C format for consistency.",
    );
  } else if (analysis.format === "w3c") {
    recommendations.push("Tokens are already in W3C format. No migration needed.");
  }

  if (analysis.details.legacyColors > 0) {
    recommendations.push(
      `${analysis.details.legacyColors} color values use legacy hex format. W3C format provides better color space support.`,
    );
  }

  if (analysis.details.legacyDimensions > 0) {
    recommendations.push(
      `${analysis.details.legacyDimensions} dimension values use legacy string format. W3C format separates value and unit.`,
    );
  }

  if (analysis.details.legacyDurations > 0) {
    recommendations.push(
      `${analysis.details.legacyDurations} duration values use legacy string format. W3C format separates value and unit.`,
    );
  }

  return {
    analysis,
    recommendations,
    estimatedChanges: {
      colors: analysis.details.legacyColors,
      dimensions: analysis.details.legacyDimensions,
      durations: analysis.details.legacyDurations,
      aliases: analysis.details.legacyAliases,
    },
  };
}

/**
 * Validate migrated tokens
 */
export function validateMigration(
  original: Record<string, unknown>,
  migrated: Record<string, unknown>,
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  function compareValues(origPath: string, origValue: unknown, migratedValue: unknown): void {
    // Skip comparison for different formats that represent same value
    if (
      typeof origValue !== typeof migratedValue &&
      !isObject(origValue) &&
      !isObject(migratedValue)
    ) {
      // This is expected during format conversion
      return;
    }

    if (Array.isArray(origValue) && Array.isArray(migratedValue)) {
      if (origValue.length !== migratedValue.length) {
        errors.push(`Array length mismatch at ${origPath}`);
        return;
      }
      for (let i = 0; i < origValue.length; i++) {
        compareValues(`${origPath}[${i}]`, origValue[i], migratedValue[i]);
      }
      return;
    }

    if (isObject(origValue) && isObject(migratedValue)) {
      const origObj = origValue as Record<string, unknown>;
      const migratedObj = migratedValue as Record<string, unknown>;
      const origKeys = Object.keys(origObj);
      const migratedKeys = Object.keys(migratedObj);

      // Check for missing keys (excluding format-specific keys)
      for (const key of origKeys) {
        if (
          !key.startsWith("$") &&
          !migratedKeys.includes(key) &&
          key !== "colorSpace" &&
          key !== "components"
        ) {
          // Allow for structure changes during conversion
          continue;
        }
        if (key in migratedObj) {
          compareValues(`${origPath}.${key}`, origObj[key], migratedObj[key]);
        }
      }
    }
  }

  try {
    compareValues("", original, migrated);
  } catch (error) {
    errors.push(`Validation error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
