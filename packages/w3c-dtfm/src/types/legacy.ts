/**
 * Legacy Design Token Types (pre-W3C format)
 * These types are kept for backwards compatibility and will be deprecated in future versions.
 * @deprecated Use W3C-compliant types from './w3c' instead
 */

import type { TokenTypes } from "../constants";
import type { W3CIconValue, W3CAssetValue } from "./w3c";

/**
 * @deprecated Use W3CColorValue instead
 */
export type LegacyColor = `#${string}`;

/**
 * @deprecated Use W3CDimensionValue instead
 */
export type LegacyDimension = `${number}px` | `${number}rem`;

/**
 * @deprecated Use W3CDurationValue instead
 */
export type LegacyDuration = `${number}ms` | `${number}s`;

export type LegacyCubicBezier = [number, number, number, number];

export type LegacyFontWeightName =
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

export type LegacyFontWeight =
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
  | LegacyFontWeightName;

export type LegacyFontFamily = string | string[];

export interface LegacyStrokeStyleObject {
  lineCap: "butt" | "round" | "square";
  dashArray: LegacyDimension[];
}

export type LegacyStrokeStyleName =
  | "solid"
  | "dashed"
  | "dotted"
  | "double"
  | "groove"
  | "ridge"
  | "inset"
  | "outset";

export type LegacyStrokeStyle = LegacyStrokeStyleName | LegacyStrokeStyleObject;

/**
 * @deprecated Use W3CTokenAlias instead
 */
export type LegacyTokenAlias = `{${string}}`;

export interface LegacyShadow {
  color: LegacyColor | LegacyTokenAlias;
  offsetX: LegacyDimension | LegacyTokenAlias;
  offsetY: LegacyDimension | LegacyTokenAlias;
  blur: LegacyDimension | LegacyTokenAlias;
  spread: LegacyDimension | LegacyTokenAlias;
}

export interface LegacyBorder {
  width: LegacyDimension | LegacyTokenAlias;
  style: LegacyStrokeStyle | LegacyTokenAlias;
  color: LegacyColor | LegacyTokenAlias;
}

export interface LegacyTransition {
  duration: LegacyDuration | LegacyTokenAlias;
  delay: LegacyDuration | LegacyTokenAlias;
  timingFunction: LegacyCubicBezier | LegacyTokenAlias;
}

export interface LegacyGradientStop {
  color: LegacyColor | LegacyTokenAlias;
  position: number | LegacyTokenAlias;
}

export type LegacyGradient = LegacyGradientStop[];

export interface LegacyTypography {
  fontFamily: LegacyFontFamily | LegacyTokenAlias;
  fontSize: LegacyDimension | LegacyTokenAlias;
  fontWeight: LegacyFontWeight | LegacyTokenAlias;
  letterSpacing: LegacyDimension | LegacyTokenAlias;
  lineHeight: number | LegacyTokenAlias;
}

export interface LegacyTokens {
  color: LegacyColor;
  cubicBezier: LegacyCubicBezier;
  fontFamily: LegacyFontFamily;
  fontWeight: LegacyFontWeight;
  dimension: LegacyDimension;
  number: number;
  duration: LegacyDuration;
  strokeStyle: LegacyStrokeStyle;
  shadow: LegacyShadow | LegacyShadow[];
  border: LegacyBorder;
  transition: LegacyTransition;
  gradient: LegacyGradient;
  typography: LegacyTypography;
  link: string;
  other: unknown;
  icon: W3CIconValue;
  asset: W3CAssetValue;
}

export type LegacyTokenType = (typeof TokenTypes)[keyof typeof TokenTypes];

export interface LegacyTokenDefinition<T extends LegacyTokenType, V = LegacyTokens[T]> {
  $value: V | LegacyTokenAlias;
  $type: T;
  $description?: string;
  $extensions?: Record<string, unknown>;
}

export type LegacyDerefToken<T extends LegacyTokenDefinition<LegacyTokenType>> = {
  [K in keyof T]: Exclude<T[K], LegacyTokenAlias>;
};

export type LegacyTokenGroupItemDefinition<T extends LegacyTokenType> = Omit<
  LegacyTokenDefinition<T>,
  "$type"
>;

export interface LegacyTokenGroupDefinition<T extends LegacyTokenType> {
  $type: T;
  [key: string]: LegacyTokenGroupDefinition<T> | LegacyTokenGroupItemDefinition<T> | T | undefined;
}

export type LegacyDesignTokenDefinition<T extends LegacyTokenType> =
  | LegacyTokenDefinition<T>
  | LegacyTokenGroupDefinition<T>;

export type LegacyTokenValue<T extends LegacyTokenType> = LegacyTokens[T] | LegacyTokenAlias;

export type LegacyDesignToken =
  | LegacyTokenDefinition<"color">
  | LegacyTokenDefinition<"cubicBezier">
  | LegacyTokenDefinition<"fontFamily">
  | LegacyTokenDefinition<"fontWeight">
  | LegacyTokenDefinition<"dimension">
  | LegacyTokenDefinition<"number">
  | LegacyTokenDefinition<"duration">
  | LegacyTokenDefinition<"strokeStyle">
  | LegacyTokenDefinition<"shadow">
  | LegacyTokenDefinition<"border">
  | LegacyTokenDefinition<"transition">
  | LegacyTokenDefinition<"gradient">
  | LegacyTokenDefinition<"typography">
  | LegacyTokenDefinition<"link">
  | LegacyTokenDefinition<"other">
  | LegacyTokenDefinition<"icon">
  | LegacyTokenDefinition<"asset">;

export interface LegacyDesignTokens {
  [key: string]: LegacyDesignToken | LegacyDesignTokens | undefined;
}

/**
 * Type guard for legacy hex color string
 */
export function isLegacyColor(value: unknown): value is LegacyColor {
  return typeof value === "string" && value.startsWith("#");
}

/**
 * Type guard for legacy dimension string
 */
export function isLegacyDimension(value: unknown): value is LegacyDimension {
  if (typeof value !== "string") {
    return false;
  }
  return /^-?(\d+\.?\d*)(px|rem)$/.test(value);
}

/**
 * Type guard for legacy duration string
 */
export function isLegacyDuration(value: unknown): value is LegacyDuration {
  if (typeof value !== "string") {
    return false;
  }
  return /^\d+\.?\d*(ms|s)$/.test(value);
}

/**
 * Type guard for legacy token alias
 */
export function isLegacyTokenAlias(value: unknown): value is LegacyTokenAlias {
  if (typeof value !== "string") {
    return false;
  }
  return /^\{[^{}]+(\.[^{}]+)*\}$/.test(value);
}
