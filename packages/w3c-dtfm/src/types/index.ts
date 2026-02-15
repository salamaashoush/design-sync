/**
 * Design Token Types - Unified Exports
 *
 * This module provides both W3C-compliant types and legacy types for backwards compatibility.
 * The unified types accept both formats.
 */

// Export W3C types (primary, recommended)
export * from "./w3c";

// Export legacy types (for backwards compatibility)
export * from "./legacy";

// Re-export from constants for convenience
import type { TokenTypes } from "../constants";

// Import both for unified types
import type {
  W3CColorValue,
  W3CDimensionValue,
  W3CDurationValue,
  W3CCubicBezier,
  W3CFontFamily,
  W3CFontWeight,
  W3CFontWeightName,
  W3CStrokeStyle,
  W3CStrokeStyleObject,
  W3CShadow,
  W3CBorder,
  W3CTransition,
  W3CGradient,
  W3CTypography,
  W3CIconValue,
  W3CAssetValue,
  W3CTokenAlias,
  W3CTokenRef,
  W3CReference,
} from "./w3c";

import type {
  LegacyColor,
  LegacyDimension,
  LegacyDuration,
  LegacyStrokeStyleObject,
  LegacyShadow,
  LegacyBorder,
  LegacyTransition,
  LegacyGradient,
  LegacyTypography,
  LegacyTokenAlias,
} from "./legacy";

/**
 * Unified Color type - accepts both W3C object and legacy hex string
 */
export type Color = W3CColorValue | LegacyColor;

/**
 * Unified Dimension type - accepts both W3C object and legacy string
 */
export type Dimension = W3CDimensionValue | LegacyDimension;

/**
 * Unified Duration type - accepts both W3C object and legacy string
 */
export type Duration = W3CDurationValue | LegacyDuration;

/**
 * Unified CubicBezier type (same in both formats)
 */
export type CubicBezier = W3CCubicBezier;

/**
 * Unified FontFamily type (same in both formats)
 */
export type FontFamily = W3CFontFamily;

/**
 * Unified FontWeight type (same in both formats)
 */
export type FontWeight = W3CFontWeight;

export type FontWeightName = W3CFontWeightName;

/**
 * Unified StrokeStyle type - accepts both W3C object and legacy forms
 */
export type StrokeStyleObject = W3CStrokeStyleObject | LegacyStrokeStyleObject;
export type StrokeStyle = W3CStrokeStyle;
export type StrokeStyleName = W3CStrokeStyle extends infer T
  ? T extends string
    ? T
    : never
  : never;

/**
 * Unified Token Alias - supports both curly brace and $ref syntax
 */
export type TokenAlias = W3CTokenAlias | LegacyTokenAlias;
export type TokenRef = W3CTokenRef;
export type Reference = W3CReference;

/**
 * Unified Shadow type - accepts both W3C and legacy
 */
export type Shadow = W3CShadow | LegacyShadow;

/**
 * Unified Border type - accepts both W3C and legacy
 */
export type Border = W3CBorder | LegacyBorder;

/**
 * Unified Transition type - accepts both W3C and legacy
 */
export type Transition = W3CTransition | LegacyTransition;

/**
 * Unified Gradient type - accepts both W3C and legacy
 */
export type Gradient = W3CGradient | LegacyGradient;

/**
 * Unified Typography type - accepts both W3C and legacy
 */
export type Typography = W3CTypography | LegacyTypography;

/**
 * Unified Tokens interface - values can be either format
 */
export interface Tokens {
  color: Color;
  cubicBezier: CubicBezier;
  fontFamily: FontFamily;
  fontWeight: FontWeight;
  dimension: Dimension;
  number: number;
  duration: Duration;
  strokeStyle: StrokeStyle;
  shadow: Shadow | Shadow[];
  border: Border;
  transition: Transition;
  gradient: Gradient;
  typography: Typography;
  link: string;
  other: unknown;
  icon: W3CIconValue;
  asset: W3CAssetValue;
}

/**
 * Unified TokenType
 */
export type TokenType = (typeof TokenTypes)[keyof typeof TokenTypes];

/**
 * Unified TokenDefinition - accepts both W3C and legacy
 */
export interface TokenDefinition<T extends TokenType, V = Tokens[T]> {
  $value: V | TokenAlias;
  $type: T;
  $description?: string;
  $extensions?: Record<string, unknown>;
  $deprecated?: boolean | string; // W3C addition
}

export type DerefToken<T extends TokenDefinition<TokenType>> = {
  [K in keyof T]: Exclude<T[K], TokenAlias>;
};

export type TokenGroupItemDefinition<T extends TokenType> = Omit<TokenDefinition<T>, "$type">;

export interface TokenGroupDefinition<T extends TokenType> {
  $type: T;
  $extends?: Reference; // W3C addition
  $root?: Omit<TokenDefinition<T>, "$type">; // W3C addition
  [key: string]: TokenGroupDefinition<T> | TokenGroupItemDefinition<T> | T | Reference | undefined;
}

export type DesignTokenDefinition<T extends TokenType> =
  | TokenDefinition<T>
  | TokenGroupDefinition<T>;

export type TokenValue<T extends TokenType> = Tokens[T] | TokenAlias;

/**
 * Unified DesignToken (discriminated union)
 */
export type DesignToken =
  | TokenDefinition<"color">
  | TokenDefinition<"cubicBezier">
  | TokenDefinition<"fontFamily">
  | TokenDefinition<"fontWeight">
  | TokenDefinition<"dimension">
  | TokenDefinition<"number">
  | TokenDefinition<"duration">
  | TokenDefinition<"strokeStyle">
  | TokenDefinition<"shadow">
  | TokenDefinition<"border">
  | TokenDefinition<"transition">
  | TokenDefinition<"gradient">
  | TokenDefinition<"typography">
  | TokenDefinition<"link">
  | TokenDefinition<"other">
  | TokenDefinition<"icon">
  | TokenDefinition<"asset">;

/**
 * Unified DesignTokens file structure
 */
export interface DesignTokens {
  [key: string]: DesignToken | DesignTokens | undefined;
}

/**
 * Utility types
 */
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type ReplaceTofK<T, K extends keyof T, V> = {
  [P in keyof T]: P extends K ? V : T[P];
};

/**
 * Mode extension types
 */
export interface ModeExtension<T = DesignToken["$value"]> {
  mode: Record<string, T>;
}

export interface ModesExtension {
  modes: {
    requiredModes: string[];
    defaultMode?: string;
  };
}

export type WithExtension<E, T extends DesignToken = DesignToken> = ReplaceTofK<
  RequiredKeys<T, "$extensions">,
  "$extensions",
  E
>;

/**
 * Color modifier types
 */
export type ColorModifier =
  | "darken"
  | "lighten"
  | "saturate"
  | "desaturate"
  | "alpha"
  | "contrast"
  | "invert"
  | "grayscale"
  | "sepia"
  | "hue-rotate";

export interface ColorTokenModifier {
  type: ColorModifier;
  value: string | number | Record<string, string | number>;
}

/**
 * Number type (for backwards compatibility)
 */
export type Number = number;
