import { isTokenAlias } from "../guards";
import type { W3CDimensionValue, LegacyDimension } from "../types";
import { isW3CDimensionValue } from "../types/w3c";

/**
 * CSS Dimension Units
 *
 * W3C Design Tokens spec only supports px and rem.
 * Extended mode supports all CSS units for full CSS compatibility.
 */

// W3C DTFM compliant units (strict mode)
export const W3C_DIMENSION_UNITS = ["px", "rem"] as const;
// Note: W3CDimensionUnit is exported from types/w3c.ts to avoid duplicate exports
type W3CDimensionUnit = (typeof W3C_DIMENSION_UNITS)[number];

// All CSS absolute length units
export const CSS_ABSOLUTE_UNITS = ["px", "cm", "mm", "in", "pt", "pc", "Q"] as const;

// CSS relative font units
export const CSS_FONT_RELATIVE_UNITS = ["em", "rem", "ex", "ch", "ic", "lh", "rlh", "cap"] as const;

// CSS viewport units
export const CSS_VIEWPORT_UNITS = [
  "vw",
  "vh",
  "vmin",
  "vmax",
  "vi",
  "vb",
  "svw",
  "svh",
  "svmin",
  "svmax",
  "svi",
  "svb",
  "lvw",
  "lvh",
  "lvmin",
  "lvmax",
  "lvi",
  "lvb",
  "dvw",
  "dvh",
  "dvmin",
  "dvmax",
  "dvi",
  "dvb",
] as const;

// CSS container query units
export const CSS_CONTAINER_UNITS = ["cqw", "cqh", "cqi", "cqb", "cqmin", "cqmax"] as const;

// Percentage
export const CSS_PERCENTAGE_UNIT = ["%"] as const;

// All CSS units combined
export const CSS_ALL_UNITS = [
  ...CSS_ABSOLUTE_UNITS,
  ...CSS_FONT_RELATIVE_UNITS,
  ...CSS_VIEWPORT_UNITS,
  ...CSS_CONTAINER_UNITS,
  ...CSS_PERCENTAGE_UNIT,
] as const;

export type CSSUnit = (typeof CSS_ALL_UNITS)[number];

// Regex patterns
export const W3C_DIMENSION_REGEX = /^(-?[0-9]+(?:\.[0-9]+)?)(px|rem)$/;
export const CSS_DIMENSION_REGEX =
  /^(-?[0-9]+(?:\.[0-9]+)?)(px|rem|em|ex|ch|ic|lh|rlh|cap|cm|mm|in|pt|pc|Q|vw|vh|vmin|vmax|vi|vb|svw|svh|svmin|svmax|svi|svb|lvw|lvh|lvmin|lvmax|lvi|lvb|dvw|dvh|dvmin|dvmax|dvi|dvb|cqw|cqh|cqi|cqb|cqmin|cqmax|%)$/;
export const CSS_CALC_REGEX = /^calc\(.+\)$/;

// Legacy regex for backwards compatibility
export const DIMENSION_REGEX = W3C_DIMENSION_REGEX;

/**
 * Extended dimension value that supports all CSS units
 */
export interface CSSExtendedDimensionValue {
  value: number;
  unit: CSSUnit;
}

/**
 * Dimension normalization options
 */
export interface DimensionNormalizeOptions {
  /**
   * Allow all CSS units, not just W3C spec units (px, rem)
   * @default false
   */
  allowAllCSSUnits?: boolean;
  /**
   * Allow calc() expressions
   * @default false
   */
  allowCalc?: boolean;
  /**
   * Coerce bare numbers to pixels
   * @default true
   */
  coerceNumbers?: boolean;
  /**
   * Suppress warning messages
   * @default false
   */
  silent?: boolean;
}

/**
 * Check if a value is a valid extended CSS dimension object
 */
export function isCSSExtendedDimensionValue(value: unknown): value is CSSExtendedDimensionValue {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const v = value as Record<string, unknown>;
  return (
    typeof v.value === "number" &&
    typeof v.unit === "string" &&
    CSS_ALL_UNITS.includes(v.unit as CSSUnit)
  );
}

/**
 * Normalize a dimension value
 *
 * Accepts:
 * - W3C format: { value: 10, unit: "px" }
 * - Extended CSS format: { value: 10, unit: "em" } (with allowAllCSSUnits)
 * - Legacy format: "10px", "10rem", "10em", "50%", etc.
 * - calc() expressions (with allowCalc)
 * - Number (coerced to px with warning)
 *
 * Returns the normalized value in the input format (preserves format)
 */
export function normalizeDimensionValue(
  value: unknown,
  options: DimensionNormalizeOptions = {},
): W3CDimensionValue | CSSExtendedDimensionValue | LegacyDimension | string {
  const {
    allowAllCSSUnits = false,
    allowCalc = false,
    coerceNumbers = true,
    silent = false,
  } = options;

  if (isTokenAlias(value)) {
    return value;
  }

  // W3C format object
  if (isW3CDimensionValue(value)) {
    return value as W3CDimensionValue;
  }

  // Extended CSS format object
  if (allowAllCSSUnits && isCSSExtendedDimensionValue(value)) {
    return value as CSSExtendedDimensionValue;
  }

  // Object with value/unit that might have extended units
  if (typeof value === "object" && value !== null) {
    const v = value as Record<string, unknown>;
    if (typeof v.value === "number" && typeof v.unit === "string") {
      // Check if it's a valid unit
      if (W3C_DIMENSION_UNITS.includes(v.unit as W3CDimensionUnit)) {
        return { value: v.value, unit: v.unit } as W3CDimensionValue;
      }
      if (allowAllCSSUnits && CSS_ALL_UNITS.includes(v.unit as CSSUnit)) {
        return { value: v.value, unit: v.unit } as CSSExtendedDimensionValue;
      }
      throw new Error(
        `Invalid dimension unit "${v.unit}". ${allowAllCSSUnits ? `Must be one of: ${CSS_ALL_UNITS.join(", ")}` : 'W3C spec only allows "px" or "rem". Use allowAllCSSUnits option for extended CSS support.'}`,
      );
    }
  }

  // Legacy format - number (coerce to px)
  if (typeof value === "number") {
    if (coerceNumbers) {
      if (!silent) {
        console.warn(
          'DTFM dimension value should be a string in the format "10px" or "10rem" or a W3C dimension object (got number) - coercing to pixels',
        );
      }
      return `${value}px` as LegacyDimension;
    }
    throw new Error("Number values must be converted to dimension strings with units");
  }

  // Legacy format - string
  if (typeof value === "string") {
    // Handle calc() expressions
    if (CSS_CALC_REGEX.test(value)) {
      if (allowCalc) {
        return value;
      }
      throw new Error(
        "calc() expressions are not allowed by default. Use allowCalc option to enable them.",
      );
    }

    // Check W3C units first
    if (W3C_DIMENSION_REGEX.test(value)) {
      return value as LegacyDimension;
    }

    // Check extended CSS units
    if (allowAllCSSUnits && CSS_DIMENSION_REGEX.test(value)) {
      return value;
    }

    // Handle bare "0"
    if (parseFloat(value) === 0 && !value.match(/[a-zA-Z%]/)) {
      if (!silent) {
        console.warn(
          'DTFM dimension value should be a string in the format "10px" or "10rem" or a W3C dimension object (got "0") - coercing to pixels',
        );
      }
      return "0px" as LegacyDimension;
    }

    // Check if it looks like a dimension but with unsupported unit
    const extendedMatch = value.match(CSS_DIMENSION_REGEX);
    if (extendedMatch && !allowAllCSSUnits) {
      throw new Error(
        `Dimension unit "${extendedMatch[2]}" is not allowed. W3C spec only allows "px" or "rem". Use allowAllCSSUnits option for extended CSS support.`,
      );
    }
  }

  throw new Error(
    `${value} is not a valid DTFM dimension value (must be a W3C dimension object {value, unit}, a px/rem value eg "10px" or "10rem", or a token alias)`,
  );
}

/**
 * Destruct a dimension value into its parts
 */
export function destructDimensionValue(
  value: W3CDimensionValue | CSSExtendedDimensionValue | LegacyDimension | string,
): { number: number; unit: string } {
  if (typeof value === "object" && value !== null && "value" in value && "unit" in value) {
    return { number: value.value, unit: value.unit };
  }

  if (typeof value === "string") {
    const match = value.match(CSS_DIMENSION_REGEX);
    if (match) {
      return { number: parseFloat(match[1]), unit: match[2] };
    }
  }

  throw new Error(`Cannot destruct dimension value: ${JSON.stringify(value)}`);
}

/**
 * Convert any dimension value to W3C format
 * Note: Only works with px/rem units. For other units, use the extended functions.
 */
export function dimensionToW3C(
  value: W3CDimensionValue | LegacyDimension | string,
): W3CDimensionValue {
  if (isW3CDimensionValue(value)) {
    return value as W3CDimensionValue;
  }

  if (typeof value !== "string") {
    throw new Error(`Cannot convert ${typeof value} to W3C dimension`);
  }

  const match = value.match(W3C_DIMENSION_REGEX);
  if (!match) {
    throw new Error(`Invalid dimension string: ${value}. Only px and rem are valid W3C units.`);
  }

  return {
    value: parseFloat(match[1]),
    unit: match[2] as W3CDimensionUnit,
  };
}

/**
 * Convert any dimension value to extended CSS format
 */
export function dimensionToExtended(
  value: W3CDimensionValue | CSSExtendedDimensionValue | string,
): CSSExtendedDimensionValue {
  if (typeof value === "object" && value !== null && "value" in value && "unit" in value) {
    return { value: value.value, unit: value.unit as CSSUnit };
  }

  if (typeof value !== "string") {
    throw new Error(`Cannot convert ${typeof value} to CSS dimension`);
  }

  const match = value.match(CSS_DIMENSION_REGEX);
  if (!match) {
    throw new Error(`Invalid dimension string: ${value}`);
  }

  return {
    value: parseFloat(match[1]),
    unit: match[2] as CSSUnit,
  };
}

/**
 * Convert any dimension value to legacy string format
 */
export function dimensionToLegacy(
  value: W3CDimensionValue | CSSExtendedDimensionValue | LegacyDimension | string,
): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object" && value !== null && "value" in value && "unit" in value) {
    return `${value.value}${value.unit}`;
  }

  throw new Error(`Cannot convert ${typeof value} to legacy dimension`);
}

/**
 * Convert dimension to pixels
 *
 * @param value - The dimension value
 * @param context - Context for relative unit conversion
 * @param context.remSize - Base size for rem (default: 16)
 * @param context.emSize - Base size for em (default: 16)
 * @param context.viewportWidth - Viewport width for vw/vmin/vmax
 * @param context.viewportHeight - Viewport height for vh/vmin/vmax
 */
export function dimensionToPx(
  value: W3CDimensionValue | CSSExtendedDimensionValue | LegacyDimension | string,
  context: {
    remSize?: number;
    emSize?: number;
    viewportWidth?: number;
    viewportHeight?: number;
    containerWidth?: number;
    containerHeight?: number;
  } = {},
): number {
  const {
    remSize = 16,
    emSize = 16,
    viewportWidth = 1920,
    viewportHeight = 1080,
    containerWidth = 1920,
    containerHeight = 1080,
  } = context;

  const { number, unit } = destructDimensionValue(typeof value === "string" ? value : value);

  // Absolute units
  switch (unit) {
    case "px":
      return number;
    case "cm":
      return number * 37.7953;
    case "mm":
      return number * 3.77953;
    case "in":
      return number * 96;
    case "pt":
      return number * 1.33333;
    case "pc":
      return number * 16;
    case "Q":
      return number * 0.944882;
  }

  // Font-relative units
  switch (unit) {
    case "rem":
      return number * remSize;
    case "em":
      return number * emSize;
    case "ex":
      return number * emSize * 0.5; // Approximation
    case "ch":
      return number * emSize * 0.5; // Approximation
    case "lh":
    case "rlh":
      return number * emSize * 1.2; // Approximation
  }

  // Viewport units
  switch (unit) {
    case "vw":
    case "svw":
    case "lvw":
    case "dvw":
      return (number / 100) * viewportWidth;
    case "vh":
    case "svh":
    case "lvh":
    case "dvh":
      return (number / 100) * viewportHeight;
    case "vmin":
    case "svmin":
    case "lvmin":
    case "dvmin":
      return (number / 100) * Math.min(viewportWidth, viewportHeight);
    case "vmax":
    case "svmax":
    case "lvmax":
    case "dvmax":
      return (number / 100) * Math.max(viewportWidth, viewportHeight);
    case "vi":
    case "svi":
    case "lvi":
    case "dvi":
      return (number / 100) * viewportWidth; // Assuming horizontal writing mode
    case "vb":
    case "svb":
    case "lvb":
    case "dvb":
      return (number / 100) * viewportHeight; // Assuming horizontal writing mode
  }

  // Container units
  switch (unit) {
    case "cqw":
      return (number / 100) * containerWidth;
    case "cqh":
      return (number / 100) * containerHeight;
    case "cqi":
      return (number / 100) * containerWidth; // Assuming horizontal
    case "cqb":
      return (number / 100) * containerHeight; // Assuming horizontal
    case "cqmin":
      return (number / 100) * Math.min(containerWidth, containerHeight);
    case "cqmax":
      return (number / 100) * Math.max(containerWidth, containerHeight);
  }

  // Percentage (needs context, assume relative to container width)
  if (unit === "%") {
    return (number / 100) * containerWidth;
  }

  throw new Error(`Cannot convert ${unit} to pixels`);
}

/**
 * Check if a dimension string is valid
 */
export function isValidDimension(
  value: string,
  options: { allowAllCSSUnits?: boolean; allowCalc?: boolean } = {},
): boolean {
  const { allowAllCSSUnits = false, allowCalc = false } = options;

  if (allowCalc && CSS_CALC_REGEX.test(value)) {
    return true;
  }

  if (allowAllCSSUnits) {
    return CSS_DIMENSION_REGEX.test(value);
  }

  return W3C_DIMENSION_REGEX.test(value);
}

/**
 * Parse a dimension string and return its components
 */
export function parseDimension(
  value: string,
  options: { allowAllCSSUnits?: boolean } = {},
): { value: number; unit: string } | null {
  const { allowAllCSSUnits = false } = options;
  const regex = allowAllCSSUnits ? CSS_DIMENSION_REGEX : W3C_DIMENSION_REGEX;
  const match = value.match(regex);

  if (!match) {
    return null;
  }

  return {
    value: parseFloat(match[1]),
    unit: match[2],
  };
}
