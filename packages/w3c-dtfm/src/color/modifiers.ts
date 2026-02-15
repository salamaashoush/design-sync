/**
 * Color Modifiers
 *
 * Functions for modifying color values.
 */

import {
  filterBrightness,
  filterContrast,
  filterGrayscale,
  filterHueRotate,
  filterInvert,
  filterSaturate,
  filterSepia,
  formatHex,
  formatHex8,
  converter,
} from "culori/fn";
import type { Color as CuloriColor, Rgb } from "culori/fn";
import type { W3CColorValue } from "../types/w3c";
import type { ColorTokenModifier } from "../types";
import { w3cColorToCulori, culoriToW3CColor, parseColor } from "./spaces";

const toRgb = converter("rgb");

/**
 * Parse a color string or W3C color value to Culori color
 */
export function toColor(color: string | CuloriColor | W3CColorValue): CuloriColor {
  if (typeof color === "string") {
    const parsed = parseColor(color);
    if (!parsed) {
      throw new Error(`Invalid color: ${color}`);
    }
    return parsed;
  }

  // Check if it's a W3C color value
  if ("colorSpace" in color && "components" in color) {
    return w3cColorToCulori(color);
  }

  return color;
}

/**
 * Lighten a color by increasing brightness
 */
export function lightenColor(
  color: CuloriColor | string | W3CColorValue,
  amount: number,
): CuloriColor {
  return filterBrightness(amount)(toColor(color));
}

/**
 * Darken a color by decreasing brightness
 */
export function darkenColor(
  color: CuloriColor | string | W3CColorValue,
  amount: number,
): CuloriColor {
  return filterBrightness(-amount)(toColor(color));
}

/**
 * Saturate a color
 */
export function saturateColor(
  color: CuloriColor | string | W3CColorValue,
  amount: number,
): CuloriColor {
  return filterSaturate(amount)(toColor(color));
}

/**
 * Desaturate a color
 */
export function desaturateColor(
  color: CuloriColor | string | W3CColorValue,
  amount: number,
): CuloriColor {
  return filterSaturate(-amount)(toColor(color));
}

/**
 * Adjust color opacity/alpha
 */
export function opacifyColor(
  color: CuloriColor | string | W3CColorValue,
  amount: number,
): CuloriColor {
  const c = toColor(color);
  const normalizedAmount = amount < 1 ? amount : Math.min(1, amount / 100);
  return normalizedAmount < 1
    ? { ...c, alpha: c.alpha ? c.alpha - normalizedAmount : normalizedAmount }
    : c;
}

/**
 * Adjust color contrast
 */
export function contrastColor(
  color: CuloriColor | string | W3CColorValue,
  amount: number,
): CuloriColor {
  return filterContrast(amount)(toColor(color));
}

/**
 * Rotate color hue
 */
export function hueRotateColor(
  color: CuloriColor | string | W3CColorValue,
  amount: number,
): CuloriColor {
  return filterHueRotate(amount)(toColor(color));
}

/**
 * Invert a color
 */
export function invertColor(
  color: CuloriColor | string | W3CColorValue,
  amount: number,
): CuloriColor {
  return filterInvert(amount)(toColor(color));
}

/**
 * Convert color to grayscale
 */
export function grayscaleColor(
  color: CuloriColor | string | W3CColorValue,
  amount: number,
): CuloriColor {
  return filterGrayscale(amount)(toColor(color));
}

/**
 * Apply sepia filter to color
 */
export function sepiaColor(
  color: CuloriColor | string | W3CColorValue,
  amount: number,
): CuloriColor {
  return filterSepia(amount)(toColor(color));
}

/**
 * Parse a modifier value to a number
 */
export function parseModifierValue(value: unknown): number {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) {
      throw new Error(`Invalid number value ${value}`);
    }
    return parsed;
  }
  if (typeof value === "object" && value !== null) {
    return parseModifierValue((value as Record<string, unknown>).value);
  }
  throw new Error(`Invalid number value ${value}`);
}

/**
 * Apply a single color modifier
 */
export function applyColorModifier(
  color: CuloriColor | string | W3CColorValue,
  modifier: ColorTokenModifier,
): CuloriColor {
  const c = toColor(color);
  const value = parseModifierValue(modifier.value);

  switch (modifier.type) {
    case "alpha":
      return opacifyColor(c, value);
    case "contrast":
      return contrastColor(c, value);
    case "darken":
      return darkenColor(c, value);
    case "desaturate":
      return desaturateColor(c, value);
    case "grayscale":
      return grayscaleColor(c, value);
    case "hue-rotate":
      return hueRotateColor(c, value);
    case "invert":
      return invertColor(c, value);
    case "lighten":
      return lightenColor(c, value);
    case "saturate":
      return saturateColor(c, value);
    case "sepia":
      return sepiaColor(c, value);
    default:
      throw new Error(`Invalid modifier type ${modifier.type}`);
  }
}

/**
 * Apply multiple color modifiers
 */
export function applyColorModifiers(
  color: CuloriColor | string | W3CColorValue,
  modifiers?: ColorTokenModifier | ColorTokenModifier[],
): CuloriColor {
  if (!modifiers) {
    return toColor(color);
  }

  if (!Array.isArray(modifiers)) {
    return applyColorModifier(color, modifiers);
  }

  let result = toColor(color);
  for (const modifier of modifiers) {
    result = applyColorModifier(result, modifier);
  }
  return result;
}

/**
 * Format a Culori color to hex string
 */
export function formatColor(color: string | CuloriColor | W3CColorValue): string {
  const c = toColor(color);
  return typeof c.alpha === "number" && c.alpha < 1 ? formatHex8(c) : formatHex(c);
}

/**
 * Apply modifiers and return W3C color value
 */
export function applyModifiersToW3CColor(
  color: W3CColorValue,
  modifiers?: ColorTokenModifier | ColorTokenModifier[],
): W3CColorValue {
  if (!modifiers) {
    return color;
  }

  const result = applyColorModifiers(color, modifiers);
  return culoriToW3CColor(result, color.colorSpace);
}

/**
 * Mix two colors
 */
export function mixColors(
  color1: CuloriColor | string | W3CColorValue,
  color2: CuloriColor | string | W3CColorValue,
  weight: number = 0.5,
): CuloriColor {
  // Convert to RGB for interpolation
  const rgb1 = toRgb(toColor(color1)) as Rgb;
  const rgb2 = toRgb(toColor(color2)) as Rgb;

  // Simple linear interpolation in RGB space
  const r1 = rgb1.r ?? 0;
  const g1 = rgb1.g ?? 0;
  const b1 = rgb1.b ?? 0;
  const a1 = rgb1.alpha ?? 1;

  const r2 = rgb2.r ?? 0;
  const g2 = rgb2.g ?? 0;
  const b2 = rgb2.b ?? 0;
  const a2 = rgb2.alpha ?? 1;

  return {
    mode: "rgb",
    r: r1 + (r2 - r1) * weight,
    g: g1 + (g2 - g1) * weight,
    b: b1 + (b2 - b1) * weight,
    alpha: a1 + (a2 - a1) * weight,
  };
}

/**
 * Get the luminance of a color (for contrast calculations)
 */
export function getLuminance(color: CuloriColor | string | W3CColorValue): number {
  // Convert to RGB first
  const rgb = toRgb(toColor(color)) as Rgb;
  const r = rgb.r ?? 0;
  const g = rgb.g ?? 0;
  const b = rgb.b ?? 0;

  // Convert to linear RGB
  const toLinear = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));

  const rLin = toLinear(r);
  const gLin = toLinear(g);
  const bLin = toLinear(b);

  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(
  color1: CuloriColor | string | W3CColorValue,
  color2: CuloriColor | string | W3CColorValue,
): number {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if text color provides sufficient contrast on background
 * WCAG AA: 4.5:1 for normal text, 3:1 for large text
 * WCAG AAA: 7:1 for normal text, 4.5:1 for large text
 */
export function meetsContrastRequirement(
  foreground: CuloriColor | string | W3CColorValue,
  background: CuloriColor | string | W3CColorValue,
  level: "AA" | "AAA" = "AA",
  largeText: boolean = false,
): boolean {
  const ratio = getContrastRatio(foreground, background);

  if (level === "AAA") {
    return largeText ? ratio >= 4.5 : ratio >= 7;
  }

  return largeText ? ratio >= 3 : ratio >= 4.5;
}
