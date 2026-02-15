import { applyColorModifiers, formatColor, parseColor } from "../culori";
import { isTokenAlias } from "../guards";
import type { ColorTokenModifier, W3CColorValue, LegacyColor } from "../types";
import { isW3CColorValue } from "../types/w3c";
import { isLegacyColor } from "../types/legacy";
import { culoriToW3CColor, formatW3CColorToCSS } from "../color/spaces";
import { applyModifiersToW3CColor } from "../color/modifiers";

/**
 * Normalize a color value
 * Accepts:
 * - W3C format: { colorSpace: "srgb", components: [1, 0, 0], alpha?: 1 }
 * - Legacy format: "#ff0000" or any CSS color string
 *
 * Returns the normalized value in the input format (preserves format)
 */
export function normalizeColorValue(
  value: unknown,
  modifiers?: ColorTokenModifier | ColorTokenModifier[],
): W3CColorValue | LegacyColor | string {
  if (isTokenAlias(value)) {
    return value;
  }

  // W3C format
  if (isW3CColorValue(value)) {
    const colorValue = value as W3CColorValue;

    // Apply modifiers if any
    if (modifiers) {
      return applyModifiersToW3CColor(colorValue, modifiers);
    }

    return colorValue;
  }

  // Legacy format - string
  if (typeof value === "string") {
    // Check if it is not a hex color
    if (!/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value)) {
      console.warn(
        'DTFM color value should be a string in the format "#fff" or "#ffffff" or a W3C color object or a token alias (got string) - parsing as CSS color string',
      );
    }
    const parsed = parseColor(value);
    const color = applyColorModifiers(parsed, modifiers);
    if (!color) {
      throw new Error(`Failed to apply color modifiers to ${value}`);
    }
    return formatColor(color);
  }

  throw new Error(
    `${value} is not a valid DTFM color value (must be a W3C color object, a valid CSS color string eg "#fff", "rgba(0,0,0,0.5)", "white", etc, or a token alias)`,
  );
}

/**
 * Convert any color value to W3C format
 */
export function colorToW3C(value: W3CColorValue | LegacyColor | string): W3CColorValue {
  if (isW3CColorValue(value)) {
    return value as W3CColorValue;
  }

  if (typeof value !== "string") {
    throw new Error(`Cannot convert ${typeof value} to W3C color`);
  }

  const parsed = parseColor(value);
  if (!parsed) {
    throw new Error(`Invalid color string: ${value}`);
  }

  return culoriToW3CColor(parsed, "srgb");
}

/**
 * Convert any color value to legacy hex format
 */
export function colorToLegacy(value: W3CColorValue | LegacyColor | string): LegacyColor {
  if (typeof value === "string") {
    // Already legacy format
    if (isLegacyColor(value)) {
      return value as LegacyColor;
    }
    // Parse and format as hex
    return formatColor(value) as LegacyColor;
  }

  if (isW3CColorValue(value)) {
    return formatW3CColorToCSS(value as W3CColorValue) as LegacyColor;
  }

  throw new Error(`Cannot convert ${typeof value} to legacy color`);
}

/**
 * Convert any color value to CSS string
 */
export function colorToCSS(value: W3CColorValue | LegacyColor | string): string {
  if (typeof value === "string") {
    return value;
  }

  if (isW3CColorValue(value)) {
    return formatW3CColorToCSS(value as W3CColorValue);
  }

  throw new Error(`Cannot convert ${typeof value} to CSS color`);
}
