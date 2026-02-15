/**
 * W3C Design Tokens Format Module (DTFM) Compliant Types
 * @see https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/
 * @see https://www.w3.org/community/reports/design-tokens/CG-FINAL-color-20251028/
 * @see https://www.w3.org/community/reports/design-tokens/CG-FINAL-resolver-20251028/
 */

// Color component can be a number or "none" (for ambiguous zero values)
export type W3CColorComponent = number | "none";

// 14 required color spaces per W3C spec
export type W3CColorSpace =
  | "srgb"
  | "srgb-linear"
  | "hsl"
  | "hwb"
  | "lab"
  | "lch"
  | "oklab"
  | "oklch"
  | "display-p3"
  | "a98-rgb"
  | "prophoto-rgb"
  | "rec2020"
  | "xyz-d50"
  | "xyz-d65";

/**
 * W3C Color Value
 * @see https://www.w3.org/community/reports/design-tokens/CG-FINAL-color-20251028/#color-value
 */
export interface W3CColorValue {
  colorSpace: W3CColorSpace;
  components: [W3CColorComponent, W3CColorComponent, W3CColorComponent];
  alpha?: W3CColorComponent;
  /**
   * Optional hex representation for convenience (non-normative)
   * Only valid for sRGB colors
   */
  hex?: `#${string}`;
}

/**
 * W3C Dimension Value
 * @see https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/#dimension
 */
export type W3CDimensionUnit = "px" | "rem";

export interface W3CDimensionValue {
  value: number;
  unit: W3CDimensionUnit;
}

/**
 * W3C Duration Value
 * @see https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/#duration
 */
export type W3CDurationUnit = "ms" | "s";

export interface W3CDurationValue {
  value: number;
  unit: W3CDurationUnit;
}

/**
 * W3C Cubic Bezier (unchanged from legacy)
 */
export type W3CCubicBezier = [number, number, number, number];

/**
 * W3C Font Weight (unchanged from legacy)
 */
export type W3CFontWeightName =
  | "thin"
  | "hairline"
  | "extra-light"
  | "ultra-light"
  | "light"
  | "normal"
  | "regular"
  | "book"
  | "medium"
  | "semi-bold"
  | "demi-bold"
  | "bold"
  | "extra-bold"
  | "ultra-bold"
  | "black"
  | "heavy"
  | "extra-black"
  | "ultra-black";

export type W3CFontWeight =
  | number
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"
  | "950"
  | W3CFontWeightName;

/**
 * W3C Font Family (unchanged from legacy)
 */
export type W3CFontFamily = string | string[];

/**
 * W3C Stroke Style - string or object form
 * @see https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/#stroke-style
 */
export type W3CStrokeStyleName =
  | "solid"
  | "dashed"
  | "dotted"
  | "double"
  | "groove"
  | "ridge"
  | "inset"
  | "outset";

export type W3CLineCap = "round" | "butt" | "square";

export interface W3CStrokeStyleObject {
  dashArray: W3CDimensionValue[];
  lineCap: W3CLineCap;
}

export type W3CStrokeStyle = W3CStrokeStyleName | W3CStrokeStyleObject;

/**
 * Token reference using JSON Pointer syntax
 * @see https://www.w3.org/community/reports/design-tokens/CG-FINAL-resolver-20251028/#ref-syntax
 */
export interface W3CTokenRef {
  $ref: string; // JSON Pointer: "#/path/to/token"
}

/**
 * Token alias using curly brace syntax (also supported)
 */
export type W3CTokenAlias = `{${string}}`;

/**
 * Reference type can be either $ref or alias
 */
export type W3CReference = W3CTokenRef | W3CTokenAlias;

/**
 * W3C Shadow value
 */
export interface W3CShadow {
  color: W3CColorValue | W3CReference;
  offsetX: W3CDimensionValue | W3CReference;
  offsetY: W3CDimensionValue | W3CReference;
  blur: W3CDimensionValue | W3CReference;
  spread: W3CDimensionValue | W3CReference;
  inset?: boolean;
}

/**
 * W3C Border value
 */
export interface W3CBorder {
  width: W3CDimensionValue | W3CReference;
  style: W3CStrokeStyle | W3CReference;
  color: W3CColorValue | W3CReference;
}

/**
 * W3C Transition value
 */
export interface W3CTransition {
  duration: W3CDurationValue | W3CReference;
  delay: W3CDurationValue | W3CReference;
  timingFunction: W3CCubicBezier | W3CReference;
}

/**
 * W3C Gradient Stop
 */
export interface W3CGradientStop {
  color: W3CColorValue | W3CReference;
  position: number | W3CReference;
}

export type W3CGradient = W3CGradientStop[];

/**
 * W3C Typography
 */
export interface W3CTypography {
  fontFamily: W3CFontFamily | W3CReference;
  fontSize: W3CDimensionValue | W3CReference;
  fontWeight: W3CFontWeight | W3CReference;
  letterSpacing: W3CDimensionValue | W3CReference;
  lineHeight: number | W3CReference;
}

/**
 * W3C Icon Value (Extension - Kadena-style embedded SVG)
 * Not part of W3C spec yet, but likely format for future asset support
 */
export interface W3CIconValue {
  /** Icon name/identifier */
  name: string;
  /** SVG content as string */
  svg: string;
  /** Icon style variant */
  style?: "mono" | "duotone" | "color" | "outline" | "filled";
  /** Icon dimensions */
  width: number;
  height: number;
  /** Original format marker */
  format: "embedded-svg";
}

/**
 * W3C Asset Value (Extension - URL-based assets)
 * Proposed format for future W3C asset support
 */
export interface W3CAssetValue {
  /** URL or relative path to the asset */
  url: string;
  /** MIME type of the asset */
  mimeType?: string;
  /** Asset dimensions (for images/videos) */
  width?: number;
  height?: number;
  /** Alt text for accessibility */
  alt?: string;
  /** Original format marker */
  format: "url" | "data-url" | "relative-path";
}

/**
 * All W3C token value types
 */
export interface W3CTokens {
  color: W3CColorValue;
  cubicBezier: W3CCubicBezier;
  fontFamily: W3CFontFamily;
  fontWeight: W3CFontWeight;
  dimension: W3CDimensionValue;
  number: number;
  duration: W3CDurationValue;
  strokeStyle: W3CStrokeStyle;
  shadow: W3CShadow | W3CShadow[];
  border: W3CBorder;
  transition: W3CTransition;
  gradient: W3CGradient;
  typography: W3CTypography;
  link: string;
  other: unknown;
  // Asset types (extension)
  icon: W3CIconValue;
  asset: W3CAssetValue;
}

/**
 * W3C Token Types
 */
export type W3CTokenType = keyof W3CTokens;

/**
 * W3C Token Definition
 * @see https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/#design-token
 */
export interface W3CTokenDefinition<T extends W3CTokenType, V = W3CTokens[T]> {
  $value: V | W3CReference;
  $type: T;
  $description?: string;
  $extensions?: Record<string, unknown>;
  /**
   * W3C deprecation marker - boolean or string
   * @see https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/#deprecated-property
   */
  $deprecated?: boolean | string;
}

/**
 * W3C Token Group Definition
 * @see https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/#groups-0
 */
export interface W3CTokenGroupDefinition<T extends W3CTokenType> {
  $type?: T;
  $description?: string;
  $extensions?: Record<string, unknown>;
  /**
   * Group inheritance - extends another group with deep merge
   * @see https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/#extends
   */
  $extends?: W3CReference;
  /**
   * Reserved base token name in groups
   * @see https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/#root-token
   */
  $root?: Omit<W3CTokenDefinition<T>, "$type">;
  [key: string]: W3CTokenGroupDefinition<T> | Omit<W3CTokenDefinition<T>, "$type"> | unknown;
}

/**
 * W3C Design Token (discriminated union)
 */
export type W3CDesignToken =
  | W3CTokenDefinition<"color">
  | W3CTokenDefinition<"cubicBezier">
  | W3CTokenDefinition<"fontFamily">
  | W3CTokenDefinition<"fontWeight">
  | W3CTokenDefinition<"dimension">
  | W3CTokenDefinition<"number">
  | W3CTokenDefinition<"duration">
  | W3CTokenDefinition<"strokeStyle">
  | W3CTokenDefinition<"shadow">
  | W3CTokenDefinition<"border">
  | W3CTokenDefinition<"transition">
  | W3CTokenDefinition<"gradient">
  | W3CTokenDefinition<"typography">
  | W3CTokenDefinition<"link">
  | W3CTokenDefinition<"other">
  // Asset types (extension)
  | W3CTokenDefinition<"icon">
  | W3CTokenDefinition<"asset">;

/**
 * W3C Design Tokens file structure
 */
export interface W3CDesignTokens {
  $name?: string;
  $version?: string;
  $description?: string;
  [key: string]: W3CDesignToken | W3CTokenGroupDefinition<W3CTokenType> | string | undefined;
}

/**
 * Token name validation - cannot start with $ or contain {, }, .
 * @see https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/#name-and-type
 */
export const W3C_INVALID_TOKEN_NAME_START = "$";
export const W3C_INVALID_TOKEN_NAME_CHARS = ["{", "}", "."];

/**
 * Check if a token name is valid per W3C spec
 */
export function isValidW3CTokenName(name: string): boolean {
  if (name.startsWith(W3C_INVALID_TOKEN_NAME_START)) {
    return false;
  }
  for (const char of W3C_INVALID_TOKEN_NAME_CHARS) {
    if (name.includes(char)) {
      return false;
    }
  }
  return true;
}

/**
 * Type guard for W3C color value
 */
export function isW3CColorValue(value: unknown): value is W3CColorValue {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const v = value as Record<string, unknown>;
  return (
    typeof v.colorSpace === "string" && Array.isArray(v.components) && v.components.length === 3
  );
}

/**
 * Type guard for W3C dimension value
 */
export function isW3CDimensionValue(value: unknown): value is W3CDimensionValue {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const v = value as Record<string, unknown>;
  return typeof v.value === "number" && (v.unit === "px" || v.unit === "rem");
}

/**
 * Type guard for W3C duration value
 */
export function isW3CDurationValue(value: unknown): value is W3CDurationValue {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const v = value as Record<string, unknown>;
  return typeof v.value === "number" && (v.unit === "ms" || v.unit === "s");
}

/**
 * Type guard for W3C $ref token reference
 */
export function isW3CTokenRef(value: unknown): value is W3CTokenRef {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const v = value as Record<string, unknown>;
  return typeof v.$ref === "string";
}

/**
 * Type guard for W3C stroke style object
 */
export function isW3CStrokeStyleObject(value: unknown): value is W3CStrokeStyleObject {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const v = value as Record<string, unknown>;
  return (
    Array.isArray(v.dashArray) &&
    typeof v.lineCap === "string" &&
    ["round", "butt", "square"].includes(v.lineCap)
  );
}
