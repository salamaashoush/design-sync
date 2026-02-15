/**
 * Duration Normalizer
 *
 * Supports both W3C object format and legacy string format.
 */

import { isTokenAlias } from "../guards";
import type { W3CDurationValue, LegacyDuration } from "../types";
import { isW3CDurationValue } from "../types/w3c";

const DURATION_REGEX = /^\d+(\.\d+)?(ms|s)$/;

/**
 * Normalize a duration value
 * Accepts:
 * - W3C format: { value: 500, unit: "ms" }
 * - Legacy format: "500ms" or "0.5s"
 * - Number (coerced to ms with warning)
 *
 * Returns the normalized value in the input format
 */
export function normalizeDurationValue(value: unknown): W3CDurationValue | LegacyDuration | string {
  if (isTokenAlias(value)) {
    return value;
  }

  // W3C format
  if (isW3CDurationValue(value)) {
    const durValue = value as W3CDurationValue;

    // Validate
    if (typeof durValue.value !== "number" || durValue.value < 0) {
      throw new Error(
        `Invalid W3C duration value: ${durValue.value}. Must be a non-negative number.`,
      );
    }

    if (durValue.unit !== "ms" && durValue.unit !== "s") {
      throw new Error(`Invalid W3C duration unit: ${durValue.unit}. Must be "ms" or "s".`);
    }

    return durValue;
  }

  // Legacy format - number (coerce to ms)
  if (typeof value === "number") {
    console.warn(
      'DTFM duration value should be a string in the format "0.5s" or "500ms" or a W3C duration object (got number) - coercing to milliseconds',
    );
    return `${value}ms` as LegacyDuration;
  }

  // Legacy format - string
  if (typeof value === "string") {
    // Allow '0'
    if (parseFloat(value) === 0) {
      return "0ms" as LegacyDuration;
    }

    if (DURATION_REGEX.test(value)) {
      return value as LegacyDuration;
    }
  }

  throw new Error(
    `${typeof value} is not a valid DTFM duration value (must be a W3C duration object {value, unit}, a string like "0.5s" or "500ms", or a token alias)`,
  );
}

/**
 * Convert any duration value to W3C format
 */
export function durationToW3C(value: W3CDurationValue | LegacyDuration | string): W3CDurationValue {
  if (isW3CDurationValue(value)) {
    return value as W3CDurationValue;
  }

  if (typeof value !== "string") {
    throw new Error(`Cannot convert ${typeof value} to W3C duration`);
  }

  const match = value.match(/^(\d+\.?\d*)(ms|s)$/);
  if (!match) {
    throw new Error(`Invalid duration string: ${value}`);
  }

  return {
    value: parseFloat(match[1]),
    unit: match[2] as "ms" | "s",
  };
}

/**
 * Convert any duration value to legacy string format
 */
export function durationToLegacy(
  value: W3CDurationValue | LegacyDuration | string,
): LegacyDuration {
  if (typeof value === "string") {
    return value as LegacyDuration;
  }

  if (isW3CDurationValue(value)) {
    const dur = value as W3CDurationValue;
    return `${dur.value}${dur.unit}` as LegacyDuration;
  }

  throw new Error(`Cannot convert ${typeof value} to legacy duration`);
}

/**
 * Convert duration to milliseconds
 */
export function durationToMs(value: W3CDurationValue | LegacyDuration | string): number {
  const w3c = durationToW3C(value);
  return w3c.unit === "s" ? w3c.value * 1000 : w3c.value;
}

/**
 * Convert duration to seconds
 */
export function durationToSeconds(value: W3CDurationValue | LegacyDuration | string): number {
  const w3c = durationToW3C(value);
  return w3c.unit === "ms" ? w3c.value / 1000 : w3c.value;
}
