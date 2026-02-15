import { isTokenAlias } from "../guards";
import type { Color } from "../types";
import type { W3CColorValue } from "../types/w3c";
import { normalizeColorValue, colorToCSS } from "./color";
import { normalizeDimensionValue, type DimensionNormalizeOptions } from "./dimension";

/**
 * Gradient types supported by CSS
 */
export type GradientType = "linear" | "radial" | "conic";

/**
 * CSS linear gradient direction keywords
 */
export type LinearGradientDirection =
  | "to top"
  | "to top right"
  | "to right"
  | "to bottom right"
  | "to bottom"
  | "to bottom left"
  | "to left"
  | "to top left";

/**
 * Radial gradient shape
 */
export type RadialGradientShape = "circle" | "ellipse";

/**
 * Radial gradient size keyword
 */
export type RadialGradientSize =
  | "closest-side"
  | "closest-corner"
  | "farthest-side"
  | "farthest-corner";

/**
 * Direction keyword to angle mapping (degrees)
 */
export const DIRECTION_TO_ANGLE: Record<LinearGradientDirection, number> = {
  "to top": 0,
  "to top right": 45,
  "to right": 90,
  "to bottom right": 135,
  "to bottom": 180,
  "to bottom left": 225,
  "to left": 270,
  "to top left": 315,
};

/**
 * Normalized gradient stop
 */
export interface NormalizedGradientStop {
  color: Color | W3CColorValue | string;
  /**
   * Position as a number 0-1 (W3C) or CSS string like "50%" or "100px"
   */
  position?: number | string;
  /**
   * Color hint position (midpoint between this and next stop)
   * Only used when this is followed by another stop
   */
  hint?: number | string;
}

/**
 * Linear gradient specific options
 */
export interface LinearGradientOptions {
  type: "linear";
  /**
   * Angle in degrees (0 = to top, 90 = to right, 180 = to bottom)
   */
  angle?: number;
  /**
   * Direction keyword (alternative to angle)
   */
  direction?: LinearGradientDirection;
  /**
   * Repeating gradient
   */
  repeating?: boolean;
}

/**
 * Radial gradient specific options
 */
export interface RadialGradientOptions {
  type: "radial";
  /**
   * Shape: circle or ellipse (default: ellipse)
   */
  shape?: RadialGradientShape;
  /**
   * Size keyword or explicit dimensions
   */
  size?: RadialGradientSize | string;
  /**
   * Position of center (CSS position value)
   */
  position?: string;
  /**
   * Repeating gradient
   */
  repeating?: boolean;
}

/**
 * Conic gradient specific options
 */
export interface ConicGradientOptions {
  type: "conic";
  /**
   * Starting angle in degrees
   */
  fromAngle?: number;
  /**
   * Position of center (CSS position value)
   */
  position?: string;
  /**
   * Repeating gradient
   */
  repeating?: boolean;
}

/**
 * Full normalized gradient with type information
 */
export interface NormalizedGradient {
  /**
   * Gradient type
   */
  type: GradientType;
  /**
   * Color stops
   */
  stops: NormalizedGradientStop[];
  /**
   * Type-specific options
   */
  options: LinearGradientOptions | RadialGradientOptions | ConicGradientOptions;
}

/**
 * Legacy gradient (W3C format) - just color stops
 */
export type LegacyGradientStops = NormalizedGradientStop[];

/**
 * Gradient normalization options
 */
export interface GradientNormalizeOptions extends DimensionNormalizeOptions {
  /**
   * Allow extended gradient types (radial, conic) beyond linear
   * @default true
   */
  allowExtendedTypes?: boolean;
  /**
   * Preserve simple format (array of stops) when no type info is provided
   * @default true
   */
  preserveLegacyFormat?: boolean;
  /**
   * Default gradient type when not specified
   * @default "linear"
   */
  defaultType?: GradientType;
  /**
   * Default angle for linear gradients (degrees)
   * @default 180 (to bottom)
   */
  defaultAngle?: number;
}

/**
 * Check if a value is a direction keyword
 */
export function isDirectionKeyword(value: unknown): value is LinearGradientDirection {
  return typeof value === "string" && value in DIRECTION_TO_ANGLE;
}

/**
 * Convert direction keyword to angle
 */
export function directionToAngle(direction: LinearGradientDirection): number {
  return DIRECTION_TO_ANGLE[direction];
}

/**
 * Convert angle to closest direction keyword (if exact match)
 */
export function angleToDirection(angle: number): LinearGradientDirection | null {
  const normalized = ((angle % 360) + 360) % 360;
  for (const [dir, a] of Object.entries(DIRECTION_TO_ANGLE)) {
    if (a === normalized) {
      return dir as LinearGradientDirection;
    }
  }
  return null;
}

/**
 * Normalize a single gradient stop
 */
function normalizeGradientStop(
  stop: Record<string, unknown>,
  index: number,
  options: GradientNormalizeOptions = {},
): NormalizedGradientStop {
  if (!stop.color) {
    throw new Error(`Gradient stop ${index}: color is required`);
  }

  const result: NormalizedGradientStop = {
    color: normalizeColorValue(stop.color),
  };

  // Handle position
  if (stop.position !== undefined) {
    if (typeof stop.position === "number") {
      // W3C format: 0-1 range
      result.position = Math.max(0, Math.min(1, stop.position));
    } else if (typeof stop.position === "string") {
      // CSS format: "50%", "100px", etc.
      if (isTokenAlias(stop.position)) {
        result.position = stop.position;
      } else if (stop.position.endsWith("%")) {
        result.position = stop.position;
      } else {
        // Dimension value
        result.position = normalizeDimensionValue(stop.position, options) as string;
      }
    }
  }

  // Handle color hint
  if (stop.hint !== undefined) {
    if (typeof stop.hint === "number") {
      result.hint = Math.max(0, Math.min(1, stop.hint));
    } else if (typeof stop.hint === "string") {
      result.hint = stop.hint;
    }
  }

  return result;
}

/**
 * Normalize gradient stops array
 */
function normalizeGradientStops(
  stops: unknown[],
  options: GradientNormalizeOptions = {},
): NormalizedGradientStop[] {
  if (stops.length === 0) {
    throw new Error("Gradient must have at least one color stop");
  }

  return stops.map((stop, i) => {
    if (!stop || typeof stop !== "object") {
      throw new Error(`Gradient stop ${i} must be an object with color property`);
    }
    return normalizeGradientStop(stop as Record<string, unknown>, i, options);
  });
}

/**
 * Normalize gradient type-specific options
 */
function normalizeGradientOptions(
  value: Record<string, unknown>,
  options: GradientNormalizeOptions = {},
): LinearGradientOptions | RadialGradientOptions | ConicGradientOptions {
  const { allowExtendedTypes = true, defaultType = "linear", defaultAngle = 180 } = options;
  const type = (value.type as GradientType) || defaultType;

  if (!allowExtendedTypes && type !== "linear") {
    throw new Error(
      `Gradient type "${type}" is not allowed. Use allowExtendedTypes option to enable radial and conic gradients.`,
    );
  }

  switch (type) {
    case "linear": {
      const opts: LinearGradientOptions = { type: "linear" };

      if (value.direction !== undefined) {
        if (!isDirectionKeyword(value.direction)) {
          throw new Error(
            `Invalid gradient direction "${value.direction}". Must be one of: ${Object.keys(DIRECTION_TO_ANGLE).join(", ")}`,
          );
        }
        opts.direction = value.direction;
        opts.angle = directionToAngle(value.direction);
      } else if (value.angle !== undefined) {
        if (typeof value.angle !== "number") {
          throw new Error("Gradient angle must be a number (degrees)");
        }
        opts.angle = value.angle;
        // Check if angle matches a direction keyword
        const dir = angleToDirection(value.angle);
        if (dir) {
          opts.direction = dir;
        }
      } else {
        opts.angle = defaultAngle;
      }

      if (value.repeating === true) {
        opts.repeating = true;
      }

      return opts;
    }

    case "radial": {
      const opts: RadialGradientOptions = { type: "radial" };

      if (value.shape !== undefined) {
        if (value.shape !== "circle" && value.shape !== "ellipse") {
          throw new Error(
            `Invalid radial gradient shape "${value.shape}". Must be "circle" or "ellipse".`,
          );
        }
        opts.shape = value.shape;
      }

      if (value.size !== undefined) {
        const validSizes = ["closest-side", "closest-corner", "farthest-side", "farthest-corner"];
        if (typeof value.size === "string") {
          if (validSizes.includes(value.size) || isTokenAlias(value.size)) {
            opts.size = value.size;
          } else {
            // Could be explicit dimensions like "100px 50px"
            opts.size = value.size;
          }
        }
      }

      if (value.position !== undefined && typeof value.position === "string") {
        opts.position = value.position;
      }

      if (value.repeating === true) {
        opts.repeating = true;
      }

      return opts;
    }

    case "conic": {
      const opts: ConicGradientOptions = { type: "conic" };

      if (value.fromAngle !== undefined) {
        if (typeof value.fromAngle !== "number") {
          throw new Error("Conic gradient fromAngle must be a number (degrees)");
        }
        opts.fromAngle = value.fromAngle;
      }

      if (value.position !== undefined && typeof value.position === "string") {
        opts.position = value.position;
      }

      if (value.repeating === true) {
        opts.repeating = true;
      }

      return opts;
    }

    default:
      throw new Error(`Unknown gradient type "${type}". Must be "linear", "radial", or "conic".`);
  }
}

/**
 * Normalize a gradient value
 *
 * Accepts:
 * - W3C format: Array of {color, position} stops
 * - Extended format: Object with type, stops, and type-specific options
 * - Token alias
 *
 * @example
 * // W3C simple format (linear gradient, top to bottom)
 * normalizeGradientValue([
 *   { color: "#ff0000", position: 0 },
 *   { color: "#0000ff", position: 1 }
 * ])
 *
 * @example
 * // Extended linear gradient with angle
 * normalizeGradientValue({
 *   type: "linear",
 *   angle: 45,
 *   stops: [
 *     { color: "#ff0000", position: "0%" },
 *     { color: "#0000ff", position: "100%" }
 *   ]
 * })
 *
 * @example
 * // Radial gradient
 * normalizeGradientValue({
 *   type: "radial",
 *   shape: "circle",
 *   size: "farthest-corner",
 *   position: "center",
 *   stops: [
 *     { color: "#ff0000", position: 0 },
 *     { color: "#0000ff", position: 1 }
 *   ]
 * })
 *
 * @example
 * // Conic gradient
 * normalizeGradientValue({
 *   type: "conic",
 *   fromAngle: 45,
 *   position: "center",
 *   stops: [
 *     { color: "#ff0000", position: 0 },
 *     { color: "#0000ff", position: 1 }
 *   ]
 * })
 */
export function normalizeGradientValue(
  value: unknown,
  options: GradientNormalizeOptions = {},
): NormalizedGradient | LegacyGradientStops | string {
  const { preserveLegacyFormat = true, defaultType = "linear" } = options;

  if (isTokenAlias(value)) {
    return value;
  }

  if (!value || typeof value !== "object") {
    throw new Error(
      `${typeof value} is not a valid DTFM gradient value (must be an array of {color, position} stops, an object with type and stops, or a token alias)`,
    );
  }

  // Handle W3C simple format (array of stops)
  if (Array.isArray(value)) {
    if (value.length === 0) {
      throw new Error("Gradient array cannot be empty");
    }

    // Check if it has color properties (gradient stops)
    if (value.some((v) => !v || typeof v !== "object" || !("color" in v))) {
      throw new Error("Gradient stops must be objects with a color property");
    }

    const normalizedStops = normalizeGradientStops(value, options);

    // If preserving legacy format, return just the stops array
    if (preserveLegacyFormat) {
      return normalizedStops;
    }

    // Otherwise wrap in full gradient structure
    return {
      type: defaultType,
      stops: normalizedStops,
      options: { type: defaultType, angle: 180 } as LinearGradientOptions,
    };
  }

  // Handle extended format (object with type and stops)
  const obj = value as Record<string, unknown>;

  if (!("stops" in obj) || !Array.isArray(obj.stops)) {
    // Check if it's a single stop being passed as an object
    if ("color" in obj) {
      throw new Error(
        "Single gradient stop detected. Gradient must be an array of stops or an object with 'stops' array.",
      );
    }
    throw new Error("Extended gradient format requires a 'stops' array property");
  }

  const normalizedStops = normalizeGradientStops(obj.stops, options);
  const normalizedOptions = normalizeGradientOptions(obj, options);

  return {
    type: normalizedOptions.type,
    stops: normalizedStops,
    options: normalizedOptions,
  };
}

/**
 * Format a gradient stop position for CSS
 */
function formatStopPosition(position: number | string | undefined): string {
  if (position === undefined) {
    return "";
  }
  if (typeof position === "number") {
    // Convert 0-1 to percentage
    return ` ${position * 100}%`;
  }
  return ` ${position}`;
}

/**
 * Format a gradient stop for CSS
 */
function formatGradientStop(stop: NormalizedGradientStop): string {
  const color = typeof stop.color === "string" ? stop.color : colorToCSS(stop.color);
  const position = formatStopPosition(stop.position);
  const hint =
    stop.hint !== undefined
      ? ` ${typeof stop.hint === "number" ? `${stop.hint * 100}%` : stop.hint}`
      : "";
  return `${color}${position}${hint}`;
}

/**
 * Convert normalized gradient to CSS string
 */
export function gradientToCSS(gradient: NormalizedGradient | LegacyGradientStops): string {
  // Handle legacy format (just stops array)
  if (Array.isArray(gradient)) {
    const stops = gradient.map(formatGradientStop).join(", ");
    return `linear-gradient(180deg, ${stops})`;
  }

  const stops = gradient.stops.map(formatGradientStop).join(", ");

  switch (gradient.options.type) {
    case "linear": {
      const opts = gradient.options;
      const prefix = opts.repeating ? "repeating-linear-gradient" : "linear-gradient";

      // Use direction keyword if available, otherwise angle
      let direction: string;
      if (opts.direction) {
        direction = opts.direction;
      } else if (opts.angle !== undefined) {
        direction = `${opts.angle}deg`;
      } else {
        direction = "180deg";
      }

      return `${prefix}(${direction}, ${stops})`;
    }

    case "radial": {
      const opts = gradient.options;
      const prefix = opts.repeating ? "repeating-radial-gradient" : "radial-gradient";

      const parts: string[] = [];
      if (opts.shape) {
        parts.push(opts.shape);
      }
      if (opts.size) {
        parts.push(opts.size);
      }
      if (opts.position) {
        parts.push(`at ${opts.position}`);
      }

      const shapeStr = parts.length > 0 ? `${parts.join(" ")}, ` : "";
      return `${prefix}(${shapeStr}${stops})`;
    }

    case "conic": {
      const opts = gradient.options;
      const prefix = opts.repeating ? "repeating-conic-gradient" : "conic-gradient";

      const parts: string[] = [];
      if (opts.fromAngle !== undefined) {
        parts.push(`from ${opts.fromAngle}deg`);
      }
      if (opts.position) {
        parts.push(`at ${opts.position}`);
      }

      const configStr = parts.length > 0 ? `${parts.join(" ")}, ` : "";
      return `${prefix}(${configStr}${stops})`;
    }

    default:
      throw new Error(`Unknown gradient type`);
  }
}

/**
 * Parse a CSS gradient string (basic parser)
 * @experimental This is a basic parser and may not handle all CSS gradient syntaxes
 */
export function parseCSSGradient(cssString: string): NormalizedGradient | null {
  const str = cssString.trim();

  // Detect gradient type
  let type: GradientType;
  let repeating = false;

  if (str.startsWith("repeating-linear-gradient(")) {
    type = "linear";
    repeating = true;
  } else if (str.startsWith("linear-gradient(")) {
    type = "linear";
  } else if (str.startsWith("repeating-radial-gradient(")) {
    type = "radial";
    repeating = true;
  } else if (str.startsWith("radial-gradient(")) {
    type = "radial";
  } else if (str.startsWith("repeating-conic-gradient(")) {
    type = "conic";
    repeating = true;
  } else if (str.startsWith("conic-gradient(")) {
    type = "conic";
  } else {
    return null;
  }

  // Extract content between parentheses
  const openParen = str.indexOf("(");
  const closeParen = str.lastIndexOf(")");
  if (openParen === -1 || closeParen === -1) {
    return null;
  }

  const content = str.slice(openParen + 1, closeParen).trim();

  // Basic parsing - split by comma (this is simplified and won't handle all cases)
  // A proper parser would need to handle nested functions like rgb(), etc.
  const parts = splitGradientParts(content);

  if (parts.length === 0) {
    return null;
  }

  // Parse based on type
  switch (type) {
    case "linear":
      return parseLinearGradientParts(parts, repeating);
    case "radial":
      return parseRadialGradientParts(parts, repeating);
    case "conic":
      return parseConicGradientParts(parts, repeating);
    default:
      return null;
  }
}

/**
 * Split gradient content by commas, respecting nested parentheses
 */
function splitGradientParts(content: string): string[] {
  const parts: string[] = [];
  let current = "";
  let depth = 0;

  for (const char of content) {
    if (char === "(") {
      depth++;
      current += char;
    } else if (char === ")") {
      depth--;
      current += char;
    } else if (char === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    parts.push(current.trim());
  }

  return parts;
}

/**
 * Parse a color stop from a string
 */
function parseColorStop(str: string): NormalizedGradientStop | null {
  const trimmed = str.trim();

  // Try to extract color and position
  // This is simplified - a full parser would need to handle all color formats

  // Check for percentage at the end
  const percentMatch = trimmed.match(/^(.+?)\s+(\d+(?:\.\d+)?%)\s*$/);
  if (percentMatch) {
    return {
      color: percentMatch[1].trim(),
      position: percentMatch[2],
    };
  }

  // Check for dimension at the end (like 100px)
  const dimMatch = trimmed.match(/^(.+?)\s+(\d+(?:\.\d+)?(?:px|rem|em|%)?)\s*$/);
  if (dimMatch) {
    return {
      color: dimMatch[1].trim(),
      position: dimMatch[2],
    };
  }

  // Just color, no position
  return {
    color: trimmed,
  };
}

/**
 * Parse linear gradient parts
 */
function parseLinearGradientParts(parts: string[], repeating: boolean): NormalizedGradient | null {
  const stops: NormalizedGradientStop[] = [];
  const options: LinearGradientOptions = { type: "linear" };

  if (repeating) {
    options.repeating = true;
  }

  let startIndex = 0;

  // Check if first part is angle or direction
  const first = parts[0];
  if (first) {
    // Check for angle (e.g., "45deg", "0.5turn")
    const angleMatch = first.match(/^(-?\d+(?:\.\d+)?)(deg|grad|rad|turn)$/);
    if (angleMatch) {
      let angle = parseFloat(angleMatch[1]);
      const unit = angleMatch[2];
      // Convert to degrees
      switch (unit) {
        case "grad":
          angle = angle * 0.9;
          break;
        case "rad":
          angle = angle * (180 / Math.PI);
          break;
        case "turn":
          angle = angle * 360;
          break;
      }
      options.angle = angle;
      startIndex = 1;
    } else if (isDirectionKeyword(first)) {
      options.direction = first;
      options.angle = directionToAngle(first);
      startIndex = 1;
    }
  }

  // Parse remaining parts as color stops
  for (let i = startIndex; i < parts.length; i++) {
    const stop = parseColorStop(parts[i]);
    if (stop) {
      stops.push(stop);
    }
  }

  if (stops.length === 0) {
    return null;
  }

  return {
    type: "linear",
    stops,
    options,
  };
}

/**
 * Parse radial gradient parts
 */
function parseRadialGradientParts(parts: string[], repeating: boolean): NormalizedGradient | null {
  const stops: NormalizedGradientStop[] = [];
  const options: RadialGradientOptions = { type: "radial" };

  if (repeating) {
    options.repeating = true;
  }

  let startIndex = 0;

  // Check if first part contains shape/size/position info
  const first = parts[0];
  if (first) {
    const hasAt = first.includes(" at ");

    if (
      hasAt ||
      first === "circle" ||
      first === "ellipse" ||
      first.startsWith("circle ") ||
      first.startsWith("ellipse ")
    ) {
      // Parse shape and position
      if (first.startsWith("circle")) {
        options.shape = "circle";
      } else if (first.startsWith("ellipse")) {
        options.shape = "ellipse";
      }

      if (hasAt) {
        const atIndex = first.indexOf(" at ");
        options.position = first.slice(atIndex + 4).trim();
      }

      startIndex = 1;
    }
  }

  // Parse remaining parts as color stops
  for (let i = startIndex; i < parts.length; i++) {
    const stop = parseColorStop(parts[i]);
    if (stop) {
      stops.push(stop);
    }
  }

  if (stops.length === 0) {
    return null;
  }

  return {
    type: "radial",
    stops,
    options,
  };
}

/**
 * Parse conic gradient parts
 */
function parseConicGradientParts(parts: string[], repeating: boolean): NormalizedGradient | null {
  const stops: NormalizedGradientStop[] = [];
  const options: ConicGradientOptions = { type: "conic" };

  if (repeating) {
    options.repeating = true;
  }

  let startIndex = 0;

  // Check if first part contains from angle or position
  const first = parts[0];
  if (first) {
    const fromMatch = first.match(/^from\s+(-?\d+(?:\.\d+)?)(deg|grad|rad|turn)/);
    const hasAt = first.includes(" at ");

    if (fromMatch || hasAt) {
      if (fromMatch) {
        let angle = parseFloat(fromMatch[1]);
        const unit = fromMatch[2];
        switch (unit) {
          case "grad":
            angle = angle * 0.9;
            break;
          case "rad":
            angle = angle * (180 / Math.PI);
            break;
          case "turn":
            angle = angle * 360;
            break;
        }
        options.fromAngle = angle;
      }

      if (hasAt) {
        const atIndex = first.indexOf(" at ");
        options.position = first.slice(atIndex + 4).trim();
      }

      startIndex = 1;
    }
  }

  // Parse remaining parts as color stops
  for (let i = startIndex; i < parts.length; i++) {
    const stop = parseColorStop(parts[i]);
    if (stop) {
      stops.push(stop);
    }
  }

  if (stops.length === 0) {
    return null;
  }

  return {
    type: "conic",
    stops,
    options,
  };
}

/**
 * Check if a gradient is the legacy format (just stops array)
 */
export function isLegacyGradientFormat(
  value: NormalizedGradient | LegacyGradientStops,
): value is LegacyGradientStops {
  return Array.isArray(value);
}

/**
 * Convert legacy gradient format to full normalized format
 */
export function legacyToNormalizedGradient(
  stops: LegacyGradientStops,
  options: Partial<LinearGradientOptions> = {},
): NormalizedGradient {
  return {
    type: "linear",
    stops,
    options: {
      type: "linear",
      angle: options.angle ?? 180,
      direction: options.direction,
      repeating: options.repeating,
    },
  };
}
