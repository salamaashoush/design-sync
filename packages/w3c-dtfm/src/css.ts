import { camelCase } from "@design-sync/utils";
import { normalizeTokenAlias } from "./alias";
import { isTokenAlias, isTokenRef } from "./guards";
import { normalizeBorderValue } from "./normalize/border";
import { normalizeColorValue } from "./normalize/color";
import { normalizeGradientValue, gradientToCSS } from "./normalize/gradient";
import {
  normalizeIconValue,
  normalizeAssetValue,
  iconToCssValue,
  assetToCssValue,
  isNormalizedIconValue,
  isNormalizedAssetValue,
} from "./normalize/icon";
import { normalizeShadowValue, shadowsToCSS } from "./normalize/shadow";
import { normalizeStrokeStyleValue, isStrokeStyleObject } from "./normalize/stroke";
import {
  normalizeCubicBezierValue,
  normalizeTransitionValue,
  timingFunctionToCSS,
} from "./normalize/transition";
import {
  normalizeFontFamilyValue,
  normalizeFontWeightValue,
  normalizeTypographyValue,
} from "./normalize/typography";
import { processPrimitiveValue } from "./serialize";
import type { DesignToken, TokenDefinition } from "./types";
import { isW3CColorValue, isW3CDimensionValue, isW3CDurationValue } from "./types/w3c";
import { formatW3CColorToCSS } from "./color/spaces";

export function pathToCssVarName(path: string, prefix?: string) {
  return `--${prefix ?? ""}${path.replace("@", "\\@").replace(/\./g, "-")}`;
}

export function processCssVarRef(
  tokenValue: string | number,
  prefix?: string,
  defaultValue?: string,
) {
  return processPrimitiveValue(tokenValue, (path) =>
    defaultValue
      ? `var(${pathToCssVarName(path, prefix)}, ${defaultValue})`
      : `var(${pathToCssVarName(path, prefix)})`,
  );
}

export function normalizeTokenPath(path: string) {
  return (isTokenAlias(path) ? normalizeTokenAlias(path) : path).replace(/[^a-zA-Z0-9-_.]/g, "");
}

/**
 * Convert a value to CSS string, handling both W3C and legacy formats
 */
export function valueToCSSString(value: unknown): string {
  if (isW3CColorValue(value)) {
    return formatW3CColorToCSS(value);
  }
  if (isW3CDimensionValue(value)) {
    return `${value.value}${value.unit}`;
  }
  if (isW3CDurationValue(value)) {
    return `${value.value}${value.unit}`;
  }
  if (isTokenAlias(value)) {
    return normalizeTokenAlias(value);
  }
  if (isTokenRef(value)) {
    // Convert $ref to path
    return value.$ref.slice(2).replace(/\//g, ".");
  }
  return String(value);
}

interface PathToStyleNameOptions {
  textTransform?: (name: string) => string;
  count?: number;
}
export function pathToStyleName(
  path: string,
  { textTransform = camelCase, count = 3 }: PathToStyleNameOptions = {},
) {
  const parts = normalizeTokenPath(path).split(".");
  const name = parts.slice(parts.length - count).join("-");
  return textTransform(name);
}

export function tokenValueToCssValue(tokenValue: unknown) {
  if (isTokenAlias(tokenValue)) {
    return normalizeTokenAlias(tokenValue);
  }
  if (isTokenRef(tokenValue)) {
    return tokenValue.$ref.slice(2).replace(/\//g, ".");
  }
  return tokenValue;
}

export function colorToCssValue(color?: unknown): string {
  if (!color) return "";

  // Already a CSS string
  if (typeof color === "string") {
    if (isTokenAlias(color)) {
      return normalizeTokenAlias(color);
    }
    return color;
  }

  // W3C color object
  if (isW3CColorValue(color)) {
    return formatW3CColorToCSS(color);
  }

  // Try to normalize
  const normalized = normalizeColorValue(color);
  if (typeof normalized === "string") {
    return normalized;
  }
  if (isW3CColorValue(normalized)) {
    return formatW3CColorToCSS(normalized);
  }
  return String(normalized);
}

export function dimensionToCssValue(dimension?: unknown): string {
  if (dimension === undefined || dimension === null) return "";

  // Already a CSS string
  if (typeof dimension === "string") {
    if (isTokenAlias(dimension)) {
      return normalizeTokenAlias(dimension);
    }
    return dimension;
  }

  // Number - coerce to px
  if (typeof dimension === "number") {
    return `${dimension}px`;
  }

  // W3C object format { value, unit }
  if (typeof dimension === "object" && "value" in dimension && "unit" in dimension) {
    const d = dimension as { value: number; unit: string };
    return `${d.value}${d.unit}`;
  }

  return String(dimension);
}

export function durationToCssValue(duration?: unknown): string {
  if (duration === undefined || duration === null) return "";

  // Already a CSS string
  if (typeof duration === "string") {
    if (isTokenAlias(duration)) {
      return normalizeTokenAlias(duration);
    }
    return duration;
  }

  // Number - coerce to ms
  if (typeof duration === "number") {
    return `${duration}ms`;
  }

  // W3C object format { value, unit }
  if (typeof duration === "object" && "value" in duration && "unit" in duration) {
    const d = duration as { value: number; unit: string };
    return `${d.value}${d.unit}`;
  }

  return String(duration);
}

export function borderToCssStyle(border?: TokenDefinition<"border">["$value"]) {
  const value = normalizeBorderValue(border);
  if (isTokenAlias(value)) {
    return value;
  }
  return {
    borderColor: colorToCssValue(value.color),
    borderWidth: dimensionToCssValue(value.width),
    borderStyle: strokeStyleToCssValue(value.style),
  };
}

export function borderToCssValue(border?: TokenDefinition<"border">["$value"]) {
  const value = borderToCssStyle(border);
  if (isTokenAlias(value)) {
    return value;
  }
  return `${value.borderWidth} ${value.borderStyle} ${value.borderColor}`;
}

export function shadowToCssValue(value?: TokenDefinition<"shadow">["$value"]) {
  const shadows = normalizeShadowValue(value);
  if (typeof shadows === "string") {
    return shadows;
  }
  return shadowsToCSS(shadows);
}

export function strokeStyleToCssValue(stroke?: unknown): string {
  if (!stroke) return "";

  // Already a string
  if (typeof stroke === "string") {
    if (isTokenAlias(stroke)) {
      return normalizeTokenAlias(stroke);
    }
    return stroke;
  }

  const normalized = normalizeStrokeStyleValue(stroke);

  if (typeof normalized === "string") {
    return normalized;
  }

  // Object form - return "dashed" as default for custom dash arrays
  if (isStrokeStyleObject(normalized)) {
    return "dashed";
  }

  return String(normalized);
}

export function cubicBezierToCssValue(c?: TokenDefinition<"cubicBezier">["$value"]) {
  const value = normalizeCubicBezierValue(c);
  if (typeof value === "string") {
    return value;
  }
  // Handle steps timing function
  if ("type" in value && value.type === "steps") {
    return `steps(${value.steps}, ${value.jumpTerm})`;
  }
  // CubicBezier array
  return `cubic-bezier(${(value as number[]).join(", ")})`;
}

export function transitionToCssStyle(transition?: TokenDefinition<"transition">["$value"]) {
  const value = normalizeTransitionValue(transition);
  if (typeof value === "string") {
    return value;
  }
  return {
    transitionDuration: durationToCssValue(value.duration),
    transitionDelay: durationToCssValue(value.delay),
    transitionTimingFunction: timingFunctionToCSS(value.timingFunction),
  };
}

export function transitionToCssValue(transition?: TokenDefinition<"transition">["$value"]) {
  const value = transitionToCssStyle(transition);
  if (typeof value === "string") {
    return value;
  }
  return `${value.transitionDuration} ${value.transitionDelay} ${value.transitionTimingFunction}`;
}

export function fontFamilyToCssValue(fontFamily?: unknown): string {
  if (!fontFamily) return "";

  // Token alias - pass through unchanged
  if (isTokenAlias(fontFamily)) {
    return fontFamily;
  }

  // Already a string
  if (typeof fontFamily === "string") {
    return fontFamily;
  }

  // Array of font families
  if (Array.isArray(fontFamily)) {
    return fontFamily.join(", ");
  }

  const value = normalizeFontFamilyValue(fontFamily);
  if (isTokenAlias(value)) {
    return value;
  }
  return Array.isArray(value) ? value.join(", ") : String(value);
}

export function fontWeightToCssValue(fontWeight?: unknown): string | number {
  if (fontWeight === undefined || fontWeight === null) return "";

  // Token alias - pass through unchanged
  if (isTokenAlias(fontWeight)) {
    return fontWeight;
  }

  // Normalize to get numeric value for named weights
  const value = normalizeFontWeightValue(fontWeight);
  if (isTokenAlias(value)) {
    return value;
  }
  return value;
}

export function typographyToCssStyle(typography?: unknown) {
  const value = normalizeTypographyValue(typography);
  if (typeof value === "string") {
    return value;
  }

  return {
    fontFamily: fontFamilyToCssValue(value.fontFamily),
    fontSize: dimensionToCssValue(value.fontSize),
    fontWeight: fontWeightToCssValue(value.fontWeight),
    lineHeight: value.lineHeight !== undefined ? dimensionToCssValue(value.lineHeight) : undefined,
    letterSpacing:
      value.letterSpacing !== undefined ? dimensionToCssValue(value.letterSpacing) : undefined,
  };
}

export function typographyToCssValue(typography?: TokenDefinition<"typography">["$value"]) {
  const value = typographyToCssStyle(typography);
  if (typeof value === "string") {
    return value;
  }
  return `${value.fontFamily} ${value.fontSize} ${value.fontWeight} ${value.lineHeight} ${value.letterSpacing}`;
}

export function gradientToCssValue(gradient?: TokenDefinition<"gradient">["$value"]) {
  const value = normalizeGradientValue(gradient);
  if (typeof value === "string") {
    return value;
  }
  // Use the full CSS gradient conversion
  return gradientToCSS(value);
}

export function tokenValueToCss(
  tokenValue: DesignToken["$value"],
  type: DesignToken["$type"],
  path?: string,
) {
  switch (type) {
    case "color":
      return colorToCssValue(tokenValue as TokenDefinition<"color">["$value"]);
    case "border":
      return borderToCssValue(tokenValue as TokenDefinition<"border">["$value"]);
    case "shadow":
      return shadowToCssValue(tokenValue as TokenDefinition<"shadow">["$value"]);
    case "strokeStyle":
      return strokeStyleToCssValue(tokenValue as TokenDefinition<"strokeStyle">["$value"]);
    case "cubicBezier":
      return cubicBezierToCssValue(tokenValue as TokenDefinition<"cubicBezier">["$value"]);
    case "transition":
      return transitionToCssValue(tokenValue as TokenDefinition<"transition">["$value"]);
    case "fontFamily":
      return fontFamilyToCssValue(tokenValue as TokenDefinition<"fontFamily">["$value"]);
    case "fontWeight":
      return fontWeightToCssValue(tokenValue as TokenDefinition<"fontWeight">["$value"]);
    case "typography":
      return typographyToCssValue(tokenValue as TokenDefinition<"typography">["$value"]);
    case "gradient":
      return gradientToCssValue(tokenValue as TokenDefinition<"gradient">["$value"]);
    case "dimension":
      return dimensionToCssValue(tokenValue as TokenDefinition<"dimension">["$value"]);
    case "duration":
      return durationToCssValue(tokenValue as TokenDefinition<"duration">["$value"]);
    case "icon": {
      const normalized = normalizeIconValue(tokenValue, path);
      if (isNormalizedIconValue(normalized)) {
        return iconToCssValue(normalized);
      }
      return String(normalized);
    }
    case "asset": {
      const normalized = normalizeAssetValue(tokenValue);
      if (isNormalizedAssetValue(normalized)) {
        return assetToCssValue(normalized);
      }
      return String(normalized);
    }
    case "link":
    case "other":
    case "number":
      return `${tokenValue}`;
    default:
      return "";
  }
}

export function tokenToCss(token: DesignToken) {
  return tokenValueToCss(token.$value, token.$type);
}
