/**
 * Format Detection
 *
 * Utilities to detect whether tokens are in legacy or W3C format.
 */

import { isObject } from "@design-sync/utils";
import {
  isW3CColorValue,
  isW3CDimensionValue,
  isW3CDurationValue,
  isW3CTokenRef,
} from "../types/w3c";
import {
  isLegacyColor,
  isLegacyDimension,
  isLegacyDuration,
  isLegacyTokenAlias,
} from "../types/legacy";

export type TokenFormat = "legacy" | "w3c" | "mixed" | "unknown";

interface FormatAnalysis {
  format: TokenFormat;
  legacyCount: number;
  w3cCount: number;
  unknownCount: number;
  details: {
    legacyColors: number;
    w3cColors: number;
    legacyDimensions: number;
    w3cDimensions: number;
    legacyDurations: number;
    w3cDurations: number;
    legacyAliases: number;
    w3cRefs: number;
  };
}

/**
 * Analyze a single value to determine its format
 */
export function detectValueFormat(value: unknown): "legacy" | "w3c" | "unknown" {
  // Check for W3C object formats first (more specific)
  if (isW3CColorValue(value)) {
    return "w3c";
  }
  if (isW3CDimensionValue(value)) {
    return "w3c";
  }
  if (isW3CDurationValue(value)) {
    return "w3c";
  }
  if (isW3CTokenRef(value)) {
    return "w3c";
  }

  // Check for legacy string formats
  if (isLegacyColor(value)) {
    return "legacy";
  }
  if (isLegacyDimension(value)) {
    return "legacy";
  }
  if (isLegacyDuration(value)) {
    return "legacy";
  }
  if (isLegacyTokenAlias(value)) {
    // Alias syntax is the same in both, but we treat it as legacy for now
    return "legacy";
  }

  // Numbers, booleans, and other primitives are format-agnostic
  if (typeof value === "number" || typeof value === "boolean") {
    return "unknown";
  }

  // Arrays (like cubic bezier, gradients) need deeper inspection
  if (Array.isArray(value)) {
    if (value.length === 4 && value.every((v) => typeof v === "number")) {
      // Cubic bezier - same in both formats
      return "unknown";
    }
    // Could be gradient stops - check first element
    if (value.length > 0) {
      return detectValueFormat(value[0]);
    }
  }

  // Objects need deeper inspection (composite types)
  if (isObject(value)) {
    const formats = Object.values(value).map(detectValueFormat);
    const hasLegacy = formats.some((f) => f === "legacy");
    const hasW3C = formats.some((f) => f === "w3c");

    if (hasLegacy && hasW3C) {
      return "unknown"; // Mixed within object
    }
    if (hasW3C) {
      return "w3c";
    }
    if (hasLegacy) {
      return "legacy";
    }
  }

  return "unknown";
}

/**
 * Recursively analyze tokens to determine overall format
 */
function analyzeTokensRecursive(
  tokens: Record<string, unknown>,
  analysis: FormatAnalysis["details"],
): void {
  for (const [key, value] of Object.entries(tokens)) {
    // Skip metadata keys
    if (key.startsWith("$")) {
      // Check $value specifically
      if (key === "$value") {
        analyzeValue(value, analysis);
      }
      continue;
    }

    if (isObject(value)) {
      // Check if it's a token or a group
      if ("$value" in value) {
        analyzeValue(value.$value, analysis);
      }
      // Recurse into nested objects
      analyzeTokensRecursive(value as Record<string, unknown>, analysis);
    }
  }
}

function analyzeValue(value: unknown, analysis: FormatAnalysis["details"]): void {
  if (isW3CColorValue(value)) {
    analysis.w3cColors++;
  } else if (isLegacyColor(value)) {
    analysis.legacyColors++;
  }

  if (isW3CDimensionValue(value)) {
    analysis.w3cDimensions++;
  } else if (isLegacyDimension(value)) {
    analysis.legacyDimensions++;
  }

  if (isW3CDurationValue(value)) {
    analysis.w3cDurations++;
  } else if (isLegacyDuration(value)) {
    analysis.legacyDurations++;
  }

  if (isW3CTokenRef(value)) {
    analysis.w3cRefs++;
  } else if (isLegacyTokenAlias(value)) {
    analysis.legacyAliases++;
  }

  // Recurse into composite values
  if (isObject(value)) {
    for (const v of Object.values(value)) {
      analyzeValue(v, analysis);
    }
  }

  if (Array.isArray(value)) {
    for (const v of value) {
      analyzeValue(v, analysis);
    }
  }
}

/**
 * Detect the format of a tokens object
 */
export function detectTokenFormat(tokens: Record<string, unknown>): TokenFormat {
  const analysis = analyzeTokens(tokens);
  return analysis.format;
}

/**
 * Analyze tokens and return detailed format information
 */
export function analyzeTokens(tokens: Record<string, unknown>): FormatAnalysis {
  const details: FormatAnalysis["details"] = {
    legacyColors: 0,
    w3cColors: 0,
    legacyDimensions: 0,
    w3cDimensions: 0,
    legacyDurations: 0,
    w3cDurations: 0,
    legacyAliases: 0,
    w3cRefs: 0,
  };

  analyzeTokensRecursive(tokens, details);

  const legacyCount =
    details.legacyColors +
    details.legacyDimensions +
    details.legacyDurations +
    details.legacyAliases;
  const w3cCount =
    details.w3cColors + details.w3cDimensions + details.w3cDurations + details.w3cRefs;

  let format: TokenFormat;
  if (legacyCount === 0 && w3cCount === 0) {
    format = "unknown";
  } else if (legacyCount > 0 && w3cCount > 0) {
    format = "mixed";
  } else if (w3cCount > 0) {
    format = "w3c";
  } else {
    format = "legacy";
  }

  return {
    format,
    legacyCount,
    w3cCount,
    unknownCount: 0,
    details,
  };
}

/**
 * Check if tokens are in W3C format
 */
export function isW3CFormat(tokens: Record<string, unknown>): boolean {
  const analysis = analyzeTokens(tokens);
  return analysis.format === "w3c" || (analysis.format === "unknown" && analysis.w3cCount === 0);
}

/**
 * Check if tokens are in legacy format
 */
export function isLegacyFormat(tokens: Record<string, unknown>): boolean {
  const analysis = analyzeTokens(tokens);
  return analysis.format === "legacy";
}

/**
 * Check if tokens contain mixed formats
 */
export function isMixedFormat(tokens: Record<string, unknown>): boolean {
  const analysis = analyzeTokens(tokens);
  return analysis.format === "mixed";
}
