import { isTokenAlias } from "../guards";
import type { Color, Dimension } from "../types";
import type { W3CDimensionValue, W3CColorValue } from "../types/w3c";
import { normalizeColorValue } from "./color";
import {
  normalizeDimensionValue,
  type DimensionNormalizeOptions,
  type CSSExtendedDimensionValue,
} from "./dimension";

/**
 * Dimension value type for shadow properties (supports all CSS units)
 */
type ShadowDimension = Dimension | W3CDimensionValue | CSSExtendedDimensionValue | string;

/**
 * Normalized shadow value
 */
export interface NormalizedShadow {
  offsetX: ShadowDimension;
  offsetY: ShadowDimension;
  blur: ShadowDimension;
  spread: ShadowDimension;
  color: Color | W3CColorValue | string;
  inset?: boolean;
}

/**
 * Shadow normalization options
 */
export interface ShadowNormalizeOptions extends DimensionNormalizeOptions {
  /**
   * Require all shadow properties to be specified
   * @default false
   */
  strict?: boolean;
}

/**
 * Default shadow dimension value
 */
const DEFAULT_DIMENSION = "0px";

/**
 * Normalize a single shadow object
 */
function normalizeSingleShadow(
  shadow: Record<string, unknown>,
  options: ShadowNormalizeOptions = {},
  errorPrefix: string = "",
): NormalizedShadow {
  const { strict = false, ...dimensionOptions } = options;

  // Validate required properties in strict mode
  if (strict) {
    const required = ["offsetX", "offsetY", "blur", "spread", "color"];
    for (const prop of required) {
      if (!(prop in shadow)) {
        throw new Error(`${errorPrefix}${prop} is required in strict mode`);
      }
    }
  }

  // Validate color is present (always required)
  if (!("color" in shadow)) {
    throw new Error(`${errorPrefix}color is required for shadow`);
  }

  // Normalize dimensions - accept any value type including negative numbers
  const normalizeOffset = (value: unknown, propName: string): ShadowDimension => {
    // Handle undefined/null - use default
    if (value === undefined || value === null) {
      return normalizeDimensionValue(DEFAULT_DIMENSION, dimensionOptions);
    }

    // Handle token alias
    if (isTokenAlias(value)) {
      return value;
    }

    // Handle number (including negative) - coerce to px
    if (typeof value === "number") {
      return `${value}px`;
    }

    // Handle W3C dimension object
    if (typeof value === "object" && "value" in value && "unit" in value) {
      return normalizeDimensionValue(value, dimensionOptions);
    }

    // Handle string dimension
    if (typeof value === "string") {
      return normalizeDimensionValue(value, dimensionOptions);
    }

    throw new Error(
      `${errorPrefix}${propName} must be a dimension value (string, number, or {value, unit} object)`,
    );
  };

  const result: NormalizedShadow = {
    offsetX: normalizeOffset(shadow.offsetX, "offsetX"),
    offsetY: normalizeOffset(shadow.offsetY, "offsetY"),
    blur: normalizeOffset(shadow.blur, "blur"),
    spread: normalizeOffset(shadow.spread, "spread"),
    color: normalizeColorValue(shadow.color),
  };

  // Handle inset property
  if ("inset" in shadow) {
    if (typeof shadow.inset !== "boolean") {
      throw new Error(`${errorPrefix}inset must be a boolean`);
    }
    result.inset = shadow.inset;
  }

  return result;
}

/**
 * Normalize a shadow value
 *
 * Accepts:
 * - Single shadow object: { offsetX, offsetY, blur, spread, color, inset? }
 * - Array of shadow objects
 * - Token alias
 *
 * Dimension properties (offsetX, offsetY, blur, spread) can be:
 * - String: "4px", "0.5rem"
 * - Number: 4 (coerced to "4px")
 * - W3C object: { value: 4, unit: "px" }
 * - Token alias: "{shadows.offset}"
 *
 * Supports negative values for offsetX and offsetY.
 *
 * @example
 * // Basic shadow
 * normalizeShadowValue({
 *   offsetX: "0px",
 *   offsetY: "4px",
 *   blur: "8px",
 *   spread: "0px",
 *   color: "#000000"
 * })
 *
 * @example
 * // Inset shadow with negative offset
 * normalizeShadowValue({
 *   offsetX: "-2px",
 *   offsetY: "-2px",
 *   blur: "4px",
 *   spread: "0px",
 *   color: "rgba(0,0,0,0.5)",
 *   inset: true
 * })
 *
 * @example
 * // Multiple shadows
 * normalizeShadowValue([
 *   { offsetX: "0px", offsetY: "2px", blur: "4px", spread: "0px", color: "#000" },
 *   { offsetX: "0px", offsetY: "4px", blur: "8px", spread: "0px", color: "#333", inset: true }
 * ])
 */
export function normalizeShadowValue(
  value: unknown,
  options: ShadowNormalizeOptions = {},
): NormalizedShadow[] | string {
  if (isTokenAlias(value)) {
    return value;
  }

  if (!value || typeof value !== "object") {
    throw new Error(
      `${typeof value} is not a valid DTFM shadow value (must be an object {offsetX, offsetY, blur, spread, color, inset?} or an array of objects, or a token alias)`,
    );
  }

  // Handle array of shadows
  if (Array.isArray(value)) {
    if (value.length === 0) {
      throw new Error("Shadow array cannot be empty");
    }

    return value.map((shadow, i) => {
      if (!shadow || typeof shadow !== "object") {
        throw new Error(`Shadow at index ${i} must be an object`);
      }
      return normalizeSingleShadow(
        shadow as Record<string, unknown>,
        options,
        value.length > 1 ? `Shadow ${i + 1}: ` : "",
      );
    });
  }

  // Handle single shadow object
  return [normalizeSingleShadow(value as Record<string, unknown>, options)];
}

/**
 * Convert a normalized shadow to CSS string
 */
export function shadowToCSS(shadow: NormalizedShadow): string {
  const parts: string[] = [];

  if (shadow.inset) {
    parts.push("inset");
  }

  // Format dimension value
  const formatDim = (dim: ShadowDimension): string => {
    if (typeof dim === "string") return dim;
    if (typeof dim === "object" && "value" in dim && "unit" in dim) {
      return `${dim.value}${dim.unit}`;
    }
    return String(dim);
  };

  parts.push(formatDim(shadow.offsetX));
  parts.push(formatDim(shadow.offsetY));
  parts.push(formatDim(shadow.blur));
  parts.push(formatDim(shadow.spread));

  // Format color
  if (typeof shadow.color === "string") {
    parts.push(shadow.color);
  } else if (typeof shadow.color === "object" && "colorSpace" in shadow.color) {
    // W3C color - format to CSS
    if (shadow.color.hex) {
      parts.push(shadow.color.hex);
    } else {
      // Use color() function for non-sRGB or fallback
      const { colorSpace, components, alpha } = shadow.color;
      const alphaStr = alpha !== undefined && alpha !== 1 ? ` / ${alpha}` : "";
      parts.push(`color(${colorSpace} ${components.join(" ")}${alphaStr})`);
    }
  }

  return parts.join(" ");
}

/**
 * Convert multiple shadows to CSS string (comma-separated)
 */
export function shadowsToCSS(shadows: NormalizedShadow[]): string {
  return shadows.map(shadowToCSS).join(", ");
}

/**
 * Parse a CSS shadow string
 * @experimental This is a basic parser and may not handle all CSS shadow syntaxes
 */
export function parseCSSshadow(cssString: string): NormalizedShadow | null {
  const str = cssString.trim();

  // Check for inset
  const inset = str.startsWith("inset ");
  const rest = inset ? str.slice(6).trim() : str;

  // Basic regex for shadow: offsetX offsetY blur? spread? color
  // This is simplified and may not handle all cases
  const match = rest.match(
    /^(-?[\d.]+\w+)\s+(-?[\d.]+\w+)(?:\s+(-?[\d.]+\w+))?(?:\s+(-?[\d.]+\w+))?\s+(.+)$/,
  );

  if (!match) {
    return null;
  }

  return {
    offsetX: match[1],
    offsetY: match[2],
    blur: match[3] || "0px",
    spread: match[4] || "0px",
    color: match[5],
    ...(inset ? { inset: true } : {}),
  };
}
