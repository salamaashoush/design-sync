/**
 * Format Converters
 *
 * Convert between legacy and W3C token value formats.
 */

import { isObject } from "@design-sync/utils";
import { parse as parseColor, formatHex, formatHex8 } from "culori/fn";
import type {
  W3CColorValue,
  W3CColorSpace,
  W3CDimensionValue,
  W3CDimensionUnit,
  W3CDurationValue,
  W3CDurationUnit,
  W3CStrokeStyleObject,
  W3CTokenRef,
} from "../types/w3c";
import {
  isW3CColorValue,
  isW3CDimensionValue,
  isW3CDurationValue,
  isW3CStrokeStyleObject,
  isW3CTokenRef,
} from "../types/w3c";
import type {
  LegacyColor,
  LegacyDimension,
  LegacyDuration,
  LegacyTokenAlias,
} from "../types/legacy";
import {
  isLegacyColor,
  isLegacyDimension,
  isLegacyDuration,
  isLegacyTokenAlias,
} from "../types/legacy";

/**
 * Convert a legacy hex color to W3C color value
 */
export function legacyColorToW3C(hex: LegacyColor): W3CColorValue {
  const parsed = parseColor(hex);
  if (!parsed) {
    throw new Error(`Invalid color: ${hex}`);
  }

  // Default to sRGB for hex colors
  // Access RGB values from the parsed color object
  const colorObj = parsed as unknown as { r?: number; g?: number; b?: number; alpha?: number };
  const r = colorObj.r ?? 0;
  const g = colorObj.g ?? 0;
  const b = colorObj.b ?? 0;
  const alpha = colorObj.alpha;

  const result: W3CColorValue = {
    colorSpace: "srgb",
    components: [r, g, b],
    hex: hex as `#${string}`,
  };

  if (alpha !== undefined && alpha < 1) {
    result.alpha = alpha;
  }

  return result;
}

/**
 * Convert a W3C color value to legacy hex format
 */
export function w3cColorToLegacy(color: W3CColorValue): LegacyColor {
  // If hex is already provided, use it
  if (color.hex) {
    return color.hex;
  }

  // Convert from colorSpace to RGB hex
  const [c1, c2, c3] = color.components.map((c) => (c === "none" ? 0 : c));
  const alpha = color.alpha === "none" ? undefined : color.alpha;

  // For sRGB, direct conversion
  if (color.colorSpace === "srgb") {
    const hex = formatHex({ mode: "rgb", r: c1, g: c2, b: c3 });
    if (alpha !== undefined && alpha < 1) {
      return formatHex8({ mode: "rgb", r: c1, g: c2, b: c3, alpha }) as LegacyColor;
    }
    return hex as LegacyColor;
  }

  // For other color spaces, would need culori conversion
  // This is a simplified implementation - full implementation would use culori
  console.warn(`Color space ${color.colorSpace} conversion to hex may lose precision`);

  // Map color space to culori mode
  const modeMap: Record<W3CColorSpace, string> = {
    srgb: "rgb",
    "srgb-linear": "lrgb",
    hsl: "hsl",
    hwb: "hwb",
    lab: "lab",
    lch: "lch",
    oklab: "oklab",
    oklch: "oklch",
    "display-p3": "p3",
    "a98-rgb": "a98",
    "prophoto-rgb": "prophoto",
    rec2020: "rec2020",
    "xyz-d50": "xyz50",
    "xyz-d65": "xyz65",
  };

  const mode = modeMap[color.colorSpace] || "rgb";

  // Create color object based on mode
  let colorObj: Record<string, number | string | undefined>;
  if (mode === "hsl") {
    colorObj = { mode, h: c1, s: c2, l: c3 };
  } else if (mode === "hwb") {
    colorObj = { mode, h: c1, w: c2, b: c3 };
  } else if (mode === "lab" || mode === "oklab") {
    colorObj = { mode, l: c1, a: c2, b: c3 };
  } else if (mode === "lch" || mode === "oklch") {
    colorObj = { mode, l: c1, c: c2, h: c3 };
  } else {
    colorObj = { mode, r: c1, g: c2, b: c3 };
  }

  if (alpha !== undefined && alpha < 1) {
    colorObj.alpha = alpha;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (formatHex8(colorObj as any) ?? "#000000ff") as LegacyColor;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (formatHex(colorObj as any) ?? "#000000") as LegacyColor;
}

/**
 * Convert a legacy dimension string to W3C dimension value
 */
export function legacyDimensionToW3C(dim: LegacyDimension): W3CDimensionValue {
  const match = dim.match(/^(-?\d+\.?\d*)(px|rem)$/);
  if (!match) {
    throw new Error(`Invalid dimension: ${dim}`);
  }

  return {
    value: parseFloat(match[1]),
    unit: match[2] as W3CDimensionUnit,
  };
}

/**
 * Convert a W3C dimension value to legacy string format
 */
export function w3cDimensionToLegacy(dim: W3CDimensionValue): LegacyDimension {
  return `${dim.value}${dim.unit}` as LegacyDimension;
}

/**
 * Convert a legacy duration string to W3C duration value
 */
export function legacyDurationToW3C(dur: LegacyDuration): W3CDurationValue {
  const match = dur.match(/^(\d+\.?\d*)(ms|s)$/);
  if (!match) {
    throw new Error(`Invalid duration: ${dur}`);
  }

  return {
    value: parseFloat(match[1]),
    unit: match[2] as W3CDurationUnit,
  };
}

/**
 * Convert a W3C duration value to legacy string format
 */
export function w3cDurationToLegacy(dur: W3CDurationValue): LegacyDuration {
  return `${dur.value}${dur.unit}` as LegacyDuration;
}

/**
 * Convert a legacy token alias to W3C $ref format
 */
export function legacyAliasToW3CRef(alias: LegacyTokenAlias): W3CTokenRef {
  // Remove curly braces and convert dots to slashes
  const path = alias.slice(1, -1).replace(/\./g, "/");
  return { $ref: `#/${path}` };
}

/**
 * Convert a W3C $ref to legacy alias format
 */
export function w3cRefToLegacyAlias(ref: W3CTokenRef): LegacyTokenAlias {
  // Remove #/ prefix and convert slashes to dots
  const path = ref.$ref.slice(2).replace(/\//g, ".");
  return `{${path}}` as LegacyTokenAlias;
}

/**
 * Convert a W3C stroke style object to legacy format
 */
export function w3cStrokeStyleToLegacy(stroke: W3CStrokeStyleObject): {
  lineCap: "butt" | "round" | "square";
  dashArray: LegacyDimension[];
} {
  return {
    lineCap: stroke.lineCap,
    dashArray: stroke.dashArray.map(w3cDimensionToLegacy),
  };
}

/**
 * Convert any value from legacy to W3C format
 */
export function convertValueToW3C(value: unknown): unknown {
  if (isLegacyColor(value)) {
    return legacyColorToW3C(value);
  }
  if (isLegacyDimension(value)) {
    return legacyDimensionToW3C(value);
  }
  if (isLegacyDuration(value)) {
    return legacyDurationToW3C(value);
  }
  if (isLegacyTokenAlias(value)) {
    // Keep alias format as-is, but could optionally convert to $ref
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(convertValueToW3C);
  }
  if (isObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, convertValueToW3C(v)]));
  }
  return value;
}

/**
 * Convert any value from W3C to legacy format
 */
export function convertValueToLegacy(value: unknown): unknown {
  if (isW3CColorValue(value)) {
    return w3cColorToLegacy(value);
  }
  if (isW3CDimensionValue(value)) {
    return w3cDimensionToLegacy(value);
  }
  if (isW3CDurationValue(value)) {
    return w3cDurationToLegacy(value);
  }
  if (isW3CTokenRef(value)) {
    return w3cRefToLegacyAlias(value);
  }
  if (isW3CStrokeStyleObject(value)) {
    return w3cStrokeStyleToLegacy(value);
  }
  if (Array.isArray(value)) {
    return value.map(convertValueToLegacy);
  }
  if (isObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, convertValueToLegacy(v)]));
  }
  return value;
}

/**
 * Parse CSS color string to W3C color value
 */
export function cssColorToW3C(
  color: string,
  targetColorSpace: W3CColorSpace = "srgb",
): W3CColorValue {
  const parsed = parseColor(color);
  if (!parsed) {
    throw new Error(`Invalid CSS color: ${color}`);
  }

  // Get RGB values and convert to target space
  const colorObj = parsed as unknown as { r?: number; g?: number; b?: number; alpha?: number };
  const r = colorObj.r ?? 0;
  const g = colorObj.g ?? 0;
  const b = colorObj.b ?? 0;
  const alpha = colorObj.alpha;

  // For now, just use sRGB
  const result: W3CColorValue = {
    colorSpace: targetColorSpace,
    components: [r, g, b],
  };

  // If it was a hex color, store it
  if (color.startsWith("#")) {
    result.hex = color as `#${string}`;
  }

  if (alpha !== undefined && alpha < 1) {
    result.alpha = alpha;
  }

  return result;
}

/**
 * Convert W3C color value to CSS color string
 */
export function w3cColorToCSS(color: W3CColorValue): string {
  // If hex is available for sRGB, use it
  if (color.colorSpace === "srgb" && color.hex) {
    return color.hex;
  }

  const [c1, c2, c3] = color.components.map((c) => (c === "none" ? 0 : c));
  const alpha = color.alpha === "none" ? undefined : color.alpha;

  // Use modern CSS color() syntax for non-sRGB colors
  if (color.colorSpace !== "srgb") {
    const colorSpace = color.colorSpace;
    const components = `${c1} ${c2} ${c3}`;
    if (alpha !== undefined && alpha < 1) {
      return `color(${colorSpace} ${components} / ${alpha})`;
    }
    return `color(${colorSpace} ${components})`;
  }

  // For sRGB, use hex
  const hex = formatHex({ mode: "rgb", r: c1, g: c2, b: c3 });
  if (alpha !== undefined && alpha < 1) {
    return formatHex8({ mode: "rgb", r: c1, g: c2, b: c3, alpha });
  }
  return hex;
}
