import { isTokenAlias } from "../guards";
import type { FontWeightName } from "../types";
import type { W3CDimensionValue } from "../types/w3c";
import {
  normalizeDimensionValue,
  type DimensionNormalizeOptions,
  type CSSExtendedDimensionValue,
} from "./dimension";

/**
 * Dimension type for typography properties (supports all CSS units)
 */
type TypographyDimension = string | W3CDimensionValue | CSSExtendedDimensionValue;

/**
 * CSS Font Style values
 */
export const FONT_STYLE_VALUES = ["normal", "italic", "oblique"] as const;
export type FontStyle = (typeof FONT_STYLE_VALUES)[number];

/**
 * CSS Font Stretch keywords
 */
export const FONT_STRETCH_KEYWORDS = [
  "ultra-condensed",
  "extra-condensed",
  "condensed",
  "semi-condensed",
  "normal",
  "semi-expanded",
  "expanded",
  "extra-expanded",
  "ultra-expanded",
] as const;
export type FontStretchKeyword = (typeof FONT_STRETCH_KEYWORDS)[number];

/**
 * CSS Font Variant values
 */
export const FONT_VARIANT_VALUES = [
  "normal",
  "small-caps",
  "all-small-caps",
  "petite-caps",
  "all-petite-caps",
  "unicase",
  "titling-caps",
] as const;
export type FontVariant = (typeof FONT_VARIANT_VALUES)[number];

/**
 * CSS Text Decoration Line values
 */
export const TEXT_DECORATION_LINE_VALUES = [
  "none",
  "underline",
  "overline",
  "line-through",
] as const;
export type TextDecorationLine = (typeof TEXT_DECORATION_LINE_VALUES)[number];

/**
 * CSS Text Decoration Style values
 */
export const TEXT_DECORATION_STYLE_VALUES = [
  "solid",
  "double",
  "dotted",
  "dashed",
  "wavy",
] as const;
export type TextDecorationStyle = (typeof TEXT_DECORATION_STYLE_VALUES)[number];

/**
 * CSS Text Transform values
 */
export const TEXT_TRANSFORM_VALUES = [
  "none",
  "capitalize",
  "uppercase",
  "lowercase",
  "full-width",
  "full-size-kana",
] as const;
export type TextTransform = (typeof TEXT_TRANSFORM_VALUES)[number];

/**
 * CSS Text Align values
 */
export const TEXT_ALIGN_VALUES = ["left", "right", "center", "justify", "start", "end"] as const;
export type TextAlign = (typeof TEXT_ALIGN_VALUES)[number];

/**
 * CSS Vertical Align values
 */
export const VERTICAL_ALIGN_KEYWORDS = [
  "baseline",
  "sub",
  "super",
  "text-top",
  "text-bottom",
  "middle",
  "top",
  "bottom",
] as const;
export type VerticalAlignKeyword = (typeof VERTICAL_ALIGN_KEYWORDS)[number];

/**
 * Font weight aliases mapped to numeric values.
 * Keys are normalized (lowercase, no hyphens/spaces) to match input normalization.
 */
export const FONT_WEIGHT_ALIASES: Record<string, number> = {
  thin: 100,
  hairline: 100,
  extralight: 200,
  ultralight: 200,
  light: 300,
  normal: 400,
  regular: 400,
  book: 400,
  medium: 500,
  semibold: 600,
  demibold: 600,
  bold: 700,
  extrabold: 800,
  ultrabold: 800,
  black: 900,
  heavy: 900,
  extrablack: 950,
  ultrablack: 950,
};

/**
 * Font stretch keyword to percentage mapping
 */
export const FONT_STRETCH_TO_PERCENTAGE: Record<FontStretchKeyword, number> = {
  "ultra-condensed": 50,
  "extra-condensed": 62.5,
  condensed: 75,
  "semi-condensed": 87.5,
  normal: 100,
  "semi-expanded": 112.5,
  expanded: 125,
  "extra-expanded": 150,
  "ultra-expanded": 200,
};

/**
 * Typography normalization options
 */
export interface TypographyNormalizeOptions extends DimensionNormalizeOptions {
  /**
   * Allow extended typography properties beyond W3C spec
   * @default true
   */
  allowExtendedProperties?: boolean;
  /**
   * Normalize font weight names to numbers
   * @default true
   */
  normalizeFontWeight?: boolean;
  /**
   * Allow unitless lineHeight values
   * @default true
   */
  allowUnitlessLineHeight?: boolean;
}

/**
 * Text decoration composite value
 */
export interface TextDecoration {
  line?: TextDecorationLine | TextDecorationLine[];
  style?: TextDecorationStyle;
  color?: string;
  thickness?: TypographyDimension;
}

/**
 * Normalized typography value
 */
export interface NormalizedTypography {
  fontFamily?: string | string[];
  fontSize?: TypographyDimension;
  fontWeight?: number | string;
  fontStyle?: FontStyle | string;
  fontStretch?: FontStretchKeyword | string;
  fontVariant?: FontVariant | string;
  lineHeight?: number | TypographyDimension;
  letterSpacing?: TypographyDimension;
  wordSpacing?: TypographyDimension;
  textDecoration?: TextDecoration | string;
  textTransform?: TextTransform;
  textAlign?: TextAlign;
  verticalAlign?: VerticalAlignKeyword | TypographyDimension;
  textIndent?: TypographyDimension;
  whiteSpace?: string;
  textOverflow?: string;
  textShadow?: string;
  paragraphSpacing?: TypographyDimension;
  paragraphIndent?: TypographyDimension;
}

/**
 * Normalize a font family value
 *
 * Accepts:
 * - Single string: "Arial"
 * - Array of strings: ["Arial", "Helvetica", "sans-serif"]
 * - Token alias: "{fonts.body}"
 */
export function normalizeFontFamilyValue(value: unknown): string | string[] {
  if (isTokenAlias(value)) {
    return value;
  }

  if (typeof value === "string") {
    return [value];
  }

  if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
    return value;
  }

  throw new Error(
    `${typeof value} is not a valid DTFM font family value (must be a string or an array of strings)`,
  );
}

/**
 * Check if a value is a valid font style
 */
export function isFontStyle(value: unknown): value is FontStyle {
  return typeof value === "string" && FONT_STYLE_VALUES.includes(value as FontStyle);
}

/**
 * Normalize a font style value
 *
 * Accepts:
 * - CSS keyword: "normal", "italic", "oblique"
 * - Oblique with angle: "oblique 14deg"
 * - Token alias
 */
export function normalizeFontStyleValue(value: unknown): FontStyle | string {
  if (isTokenAlias(value)) {
    return value;
  }

  if (typeof value !== "string") {
    throw new Error(
      `${typeof value} is not a valid font style value (must be "normal", "italic", "oblique", or "oblique <angle>")`,
    );
  }

  const lower = value.toLowerCase().trim();

  // Handle oblique with angle
  if (lower.startsWith("oblique ")) {
    return value; // Return as-is for oblique with angle
  }

  if (isFontStyle(lower)) {
    return lower;
  }

  throw new Error(
    `"${value}" is not a valid font style value (must be "normal", "italic", "oblique", or "oblique <angle>")`,
  );
}

/**
 * Check if a value is a valid font stretch keyword
 */
export function isFontStretchKeyword(value: unknown): value is FontStretchKeyword {
  return typeof value === "string" && FONT_STRETCH_KEYWORDS.includes(value as FontStretchKeyword);
}

/**
 * Normalize a font stretch value
 *
 * Accepts:
 * - CSS keyword: "condensed", "expanded", etc.
 * - Percentage: "75%", "125%"
 * - Number (percentage): 75, 125
 * - Token alias
 */
export function normalizeFontStretchValue(value: unknown): FontStretchKeyword | string {
  if (isTokenAlias(value)) {
    return value;
  }

  if (typeof value === "number") {
    return `${value}%`;
  }

  if (typeof value !== "string") {
    throw new Error(
      `${typeof value} is not a valid font stretch value (must be a keyword like "condensed" or a percentage)`,
    );
  }

  const lower = value.toLowerCase().trim();

  if (isFontStretchKeyword(lower)) {
    return lower;
  }

  // Handle percentage values
  if (lower.endsWith("%") || /^\d+(\.\d+)?$/.test(lower)) {
    return lower.endsWith("%") ? lower : `${lower}%`;
  }

  throw new Error(
    `"${value}" is not a valid font stretch value (must be a keyword like "condensed" or a percentage)`,
  );
}

/**
 * Check if a value is a valid font variant
 */
export function isFontVariant(value: unknown): value is FontVariant {
  return typeof value === "string" && FONT_VARIANT_VALUES.includes(value as FontVariant);
}

/**
 * Normalize a font variant value
 *
 * Accepts:
 * - CSS keyword: "normal", "small-caps", etc.
 * - Token alias
 */
export function normalizeFontVariantValue(value: unknown): FontVariant | string {
  if (isTokenAlias(value)) {
    return value;
  }

  if (typeof value !== "string") {
    throw new Error(
      `${typeof value} is not a valid font variant value (must be "normal", "small-caps", etc.)`,
    );
  }

  const lower = value.toLowerCase().trim();

  if (isFontVariant(lower)) {
    return lower;
  }

  // Allow extended font-variant-* values
  return value;
}

/**
 * Normalize a font weight value
 *
 * Accepts:
 * - Number: 400, 700
 * - Numeric string: "400", "700"
 * - Weight name: "normal", "bold", "semibold", "extra-bold"
 * - Token alias
 */
export function normalizeFontWeightValue(value: unknown): number | string {
  if (isTokenAlias(value)) {
    return value;
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    // Try to parse as number
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      return parsed;
    }

    // Try to parse as font weight alias
    const normalized = value.toLowerCase().replace(/[^a-z0-9]/g, "") as FontWeightName;
    const weight = FONT_WEIGHT_ALIASES[normalized];
    if (weight !== undefined) {
      return weight;
    }

    // Return as-is for CSS keywords like "bolder", "lighter"
    if (value === "bolder" || value === "lighter") {
      return value;
    }

    throw new Error(
      `"${value}" is not a valid font weight value (must be a number 1-1000 or a weight name like "bold", "semibold", etc.)`,
    );
  }

  throw new Error(
    `${typeof value} is not a valid DTFM font weight value (must be a number or ${Object.keys(
      FONT_WEIGHT_ALIASES,
    ).join(", ")} or a token alias)`,
  );
}

/**
 * Normalize a line height value
 *
 * Accepts:
 * - Unitless number: 1.5 (W3C spec)
 * - Dimension: "24px", "1.5em"
 * - Percentage: "150%"
 * - CSS keyword: "normal"
 * - Token alias
 */
export function normalizeLineHeightValue(
  value: unknown,
  options: TypographyNormalizeOptions = {},
): number | TypographyDimension {
  const { allowUnitlessLineHeight = true } = options;

  if (isTokenAlias(value)) {
    return value;
  }

  // Unitless number (W3C spec)
  if (typeof value === "number") {
    if (!allowUnitlessLineHeight) {
      throw new Error(
        "Unitless line-height values are not allowed. Use a dimension value like '1.5em' instead.",
      );
    }
    return value;
  }

  if (typeof value === "string") {
    // CSS keyword
    if (value === "normal") {
      return value;
    }

    // Check if it's a unitless number string
    const parsed = parseFloat(value);
    if (!isNaN(parsed) && !value.match(/[a-zA-Z%]/)) {
      if (!allowUnitlessLineHeight) {
        throw new Error(
          "Unitless line-height values are not allowed. Use a dimension value like '1.5em' instead.",
        );
      }
      return parsed;
    }

    // Handle dimension or percentage
    return normalizeDimensionValue(value, { ...options, allowAllCSSUnits: true });
  }

  // W3C dimension object
  if (typeof value === "object" && value !== null && "value" in value && "unit" in value) {
    return normalizeDimensionValue(value, options);
  }

  throw new Error(
    `${typeof value} is not a valid line-height value (must be a unitless number, dimension, percentage, or "normal")`,
  );
}

/**
 * Check if a value is a valid text transform
 */
export function isTextTransform(value: unknown): value is TextTransform {
  return typeof value === "string" && TEXT_TRANSFORM_VALUES.includes(value as TextTransform);
}

/**
 * Normalize a text transform value
 */
export function normalizeTextTransformValue(value: unknown): TextTransform | string {
  if (isTokenAlias(value)) {
    return value;
  }

  if (typeof value !== "string") {
    throw new Error(
      `${typeof value} is not a valid text-transform value (must be "none", "capitalize", "uppercase", "lowercase", etc.)`,
    );
  }

  const lower = value.toLowerCase().trim();

  if (isTextTransform(lower)) {
    return lower;
  }

  throw new Error(
    `"${value}" is not a valid text-transform value (must be "none", "capitalize", "uppercase", "lowercase", etc.)`,
  );
}

/**
 * Check if a value is a valid text align
 */
export function isTextAlign(value: unknown): value is TextAlign {
  return typeof value === "string" && TEXT_ALIGN_VALUES.includes(value as TextAlign);
}

/**
 * Normalize a text align value
 */
export function normalizeTextAlignValue(value: unknown): TextAlign | string {
  if (isTokenAlias(value)) {
    return value;
  }

  if (typeof value !== "string") {
    throw new Error(
      `${typeof value} is not a valid text-align value (must be "left", "right", "center", "justify", "start", "end")`,
    );
  }

  const lower = value.toLowerCase().trim();

  if (isTextAlign(lower)) {
    return lower;
  }

  throw new Error(
    `"${value}" is not a valid text-align value (must be "left", "right", "center", "justify", "start", "end")`,
  );
}

/**
 * Normalize a text decoration value
 *
 * Accepts:
 * - String shorthand: "underline", "underline dotted red"
 * - Object: { line: "underline", style: "dotted", color: "red" }
 * - Token alias
 */
export function normalizeTextDecorationValue(
  value: unknown,
  options: TypographyNormalizeOptions = {},
): TextDecoration | string {
  if (isTokenAlias(value)) {
    return value;
  }

  if (typeof value === "string") {
    return value; // Return shorthand as-is
  }

  if (typeof value === "object" && value !== null) {
    const v = value as Record<string, unknown>;
    const result: TextDecoration = {};

    if (v.line !== undefined) {
      if (Array.isArray(v.line)) {
        result.line = v.line as TextDecorationLine[];
      } else if (typeof v.line === "string") {
        result.line = v.line as TextDecorationLine;
      }
    }

    if (v.style !== undefined && typeof v.style === "string") {
      result.style = v.style as TextDecorationStyle;
    }

    if (v.color !== undefined && typeof v.color === "string") {
      result.color = v.color;
    }

    if (v.thickness !== undefined && v.thickness !== null) {
      if (typeof v.thickness === "string") {
        result.thickness = normalizeDimensionValue(v.thickness, options);
      } else if (
        typeof v.thickness === "object" &&
        "value" in v.thickness &&
        "unit" in v.thickness
      ) {
        result.thickness = normalizeDimensionValue(v.thickness, options);
      }
    }

    return result;
  }

  throw new Error(
    `${typeof value} is not a valid text-decoration value (must be a string or object)`,
  );
}

/**
 * Normalize a typography value
 *
 * Accepts:
 * - Object with typography properties
 * - Token alias
 *
 * @example
 * // Basic typography
 * normalizeTypographyValue({
 *   fontFamily: "Arial",
 *   fontSize: "16px",
 *   fontWeight: "bold",
 *   lineHeight: 1.5,
 *   letterSpacing: "0px"
 * })
 *
 * @example
 * // Extended typography
 * normalizeTypographyValue({
 *   fontFamily: ["Inter", "sans-serif"],
 *   fontSize: { value: 16, unit: "px" },
 *   fontWeight: 600,
 *   fontStyle: "italic",
 *   fontStretch: "condensed",
 *   fontVariant: "small-caps",
 *   lineHeight: "1.5em",
 *   letterSpacing: "0.02em",
 *   textTransform: "uppercase",
 *   textDecoration: { line: "underline", style: "wavy", color: "red" }
 * })
 */
export function normalizeTypographyValue(
  value: unknown,
  options: TypographyNormalizeOptions = {},
): NormalizedTypography | string {
  const { allowExtendedProperties = true } = options;

  if (isTokenAlias(value)) {
    return value;
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(
      `${typeof value} is not a valid DTFM typography value (must be an object { fontFamily, fontSize, lineHeight, letterSpacing, fontWeight, ... } or a token alias)`,
    );
  }

  const entries = Object.entries(value);

  if (!entries.length) {
    throw new Error(
      "DTFM typography value must contain at least one property (fontFamily, fontSize, lineHeight, letterSpacing, fontWeight, etc.)",
    );
  }

  const normalized: NormalizedTypography = {};

  for (const [k, v] of entries) {
    if (isTokenAlias(v)) {
      (normalized as Record<string, unknown>)[k] = v;
      continue;
    }

    switch (k) {
      case "fontFamily":
        normalized.fontFamily = normalizeFontFamilyValue(v);
        break;

      case "fontWeight":
        normalized.fontWeight = normalizeFontWeightValue(v);
        break;

      case "fontStyle":
        normalized.fontStyle = normalizeFontStyleValue(v);
        break;

      case "fontStretch":
        if (!allowExtendedProperties) {
          throw new Error(
            "fontStretch is not allowed. Use allowExtendedProperties option to enable extended typography properties.",
          );
        }
        normalized.fontStretch = normalizeFontStretchValue(v);
        break;

      case "fontVariant":
        if (!allowExtendedProperties) {
          throw new Error(
            "fontVariant is not allowed. Use allowExtendedProperties option to enable extended typography properties.",
          );
        }
        normalized.fontVariant = normalizeFontVariantValue(v);
        break;

      case "lineHeight":
        normalized.lineHeight = normalizeLineHeightValue(v, options);
        break;

      case "textTransform":
        if (!allowExtendedProperties) {
          throw new Error(
            "textTransform is not allowed. Use allowExtendedProperties option to enable extended typography properties.",
          );
        }
        normalized.textTransform = normalizeTextTransformValue(v) as TextTransform;
        break;

      case "textAlign":
        if (!allowExtendedProperties) {
          throw new Error(
            "textAlign is not allowed. Use allowExtendedProperties option to enable extended typography properties.",
          );
        }
        normalized.textAlign = normalizeTextAlignValue(v) as TextAlign;
        break;

      case "textDecoration":
        if (!allowExtendedProperties) {
          throw new Error(
            "textDecoration is not allowed. Use allowExtendedProperties option to enable extended typography properties.",
          );
        }
        normalized.textDecoration = normalizeTextDecorationValue(v, options);
        break;

      case "fontSize":
      case "letterSpacing":
      case "wordSpacing":
      case "textIndent":
      case "paragraphSpacing":
      case "paragraphIndent":
        // Dimension values
        if (typeof v === "string" || (typeof v === "object" && "value" in v && "unit" in v)) {
          (normalized as Record<string, unknown>)[k] = normalizeDimensionValue(v, {
            ...options,
            allowAllCSSUnits: true,
          });
        } else if (typeof v === "number") {
          // Coerce number to px for font dimensions
          (normalized as Record<string, unknown>)[k] = `${v}px`;
        }
        break;

      case "verticalAlign":
        if (typeof v === "string") {
          if (VERTICAL_ALIGN_KEYWORDS.includes(v as VerticalAlignKeyword)) {
            normalized.verticalAlign = v as VerticalAlignKeyword;
          } else {
            // Could be a dimension value
            normalized.verticalAlign = normalizeDimensionValue(v, {
              ...options,
              allowAllCSSUnits: true,
            });
          }
        }
        break;

      case "whiteSpace":
      case "textOverflow":
      case "textShadow":
        // Pass through string values
        if (typeof v === "string") {
          (normalized as Record<string, unknown>)[k] = v;
        }
        break;

      default:
        // Pass through unknown properties for extensibility
        (normalized as Record<string, unknown>)[k] = v;
    }
  }

  return normalized;
}

/**
 * Convert normalized typography to CSS font shorthand
 */
export function typographyToFontShorthand(typography: NormalizedTypography): string | null {
  // Font shorthand requires at least font-size and font-family
  if (!typography.fontSize || !typography.fontFamily) {
    return null;
  }

  const parts: string[] = [];

  // Font style
  if (typography.fontStyle && typography.fontStyle !== "normal") {
    parts.push(typography.fontStyle);
  }

  // Font variant
  if (typography.fontVariant && typography.fontVariant !== "normal") {
    parts.push(typography.fontVariant);
  }

  // Font weight
  if (typography.fontWeight && typography.fontWeight !== 400) {
    parts.push(String(typography.fontWeight));
  }

  // Font stretch
  if (typography.fontStretch && typography.fontStretch !== "normal") {
    parts.push(typography.fontStretch);
  }

  // Font size / line height
  let sizeStr: string;
  if (typeof typography.fontSize === "object" && "value" in typography.fontSize) {
    sizeStr = `${typography.fontSize.value}${typography.fontSize.unit}`;
  } else {
    sizeStr = String(typography.fontSize);
  }

  if (typography.lineHeight !== undefined) {
    let lineHeightStr: string;
    if (typeof typography.lineHeight === "object" && "value" in typography.lineHeight) {
      lineHeightStr = `${typography.lineHeight.value}${typography.lineHeight.unit}`;
    } else {
      lineHeightStr = String(typography.lineHeight);
    }
    sizeStr += `/${lineHeightStr}`;
  }
  parts.push(sizeStr);

  // Font family
  const family = Array.isArray(typography.fontFamily)
    ? typography.fontFamily
        .map((f) => (f.includes(" ") && !f.startsWith('"') ? `"${f}"` : f))
        .join(", ")
    : typography.fontFamily;
  parts.push(family);

  return parts.join(" ");
}

/**
 * Convert text decoration to CSS string
 */
export function textDecorationToCSS(decoration: TextDecoration): string {
  const parts: string[] = [];

  if (decoration.line) {
    if (Array.isArray(decoration.line)) {
      parts.push(decoration.line.join(" "));
    } else {
      parts.push(decoration.line);
    }
  }

  if (decoration.style) {
    parts.push(decoration.style);
  }

  if (decoration.color) {
    parts.push(decoration.color);
  }

  if (decoration.thickness) {
    if (typeof decoration.thickness === "object" && "value" in decoration.thickness) {
      parts.push(`${decoration.thickness.value}${decoration.thickness.unit}`);
    } else {
      parts.push(String(decoration.thickness));
    }
  }

  return parts.join(" ");
}
