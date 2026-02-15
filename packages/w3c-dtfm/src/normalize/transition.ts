import { isTokenAlias } from "../guards";
import type { CubicBezier, Transition } from "../types";
import { normalizeDurationValue } from "./duration";

// Re-export for backwards compatibility
export { normalizeDurationValue } from "./duration";

/**
 * CSS Easing Keywords and their cubic-bezier equivalents
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function
 */
export const CSS_EASING_KEYWORDS = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  "ease-in": [0.42, 0, 1, 1],
  "ease-out": [0, 0, 0.58, 1],
  "ease-in-out": [0.42, 0, 0.58, 1],
} as const satisfies Record<string, readonly [number, number, number, number]>;

export type CSSEasingKeyword = keyof typeof CSS_EASING_KEYWORDS;

/**
 * Steps timing function
 */
export interface StepsTimingFunction {
  type: "steps";
  steps: number;
  jumpTerm: "jump-start" | "jump-end" | "jump-none" | "jump-both" | "start" | "end";
}

/**
 * Cubic bezier timing function (explicit type)
 */
export interface CubicBezierTimingFunction {
  type: "cubic-bezier";
  values: CubicBezier;
}

/**
 * Linear timing with multiple points (CSS linear() function)
 */
export interface LinearTimingFunction {
  type: "linear";
  points?: Array<{ value: number; position?: number }>;
}

/**
 * Extended timing function type supporting all CSS easing options
 */
export type ExtendedTimingFunction =
  | CubicBezier
  | CSSEasingKeyword
  | StepsTimingFunction
  | CubicBezierTimingFunction
  | LinearTimingFunction
  | string;

/**
 * Transition normalization options
 */
export interface TransitionNormalizeOptions {
  /**
   * Allow extended CSS timing functions (steps, linear keywords)
   * @default false
   */
  allowExtendedTimingFunctions?: boolean;
  /**
   * Validate cubic-bezier X coordinates are in [0, 1] range
   * @default true
   */
  validateCubicBezier?: boolean;
}

/**
 * Check if a value is an easing keyword
 */
export function isEasingKeyword(value: unknown): value is CSSEasingKeyword {
  return typeof value === "string" && value in CSS_EASING_KEYWORDS;
}

/**
 * Check if a value is a steps timing function
 */
export function isStepsTimingFunction(value: unknown): value is StepsTimingFunction {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return v.type === "steps" && typeof v.steps === "number" && typeof v.jumpTerm === "string";
}

/**
 * Check if a value is a cubic-bezier timing function object
 */
export function isCubicBezierTimingFunction(value: unknown): value is CubicBezierTimingFunction {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return v.type === "cubic-bezier" && Array.isArray(v.values) && v.values.length === 4;
}

/**
 * Parse a CSS timing function string
 * Supports: cubic-bezier(x1, y1, x2, y2), steps(n, term), and keywords
 */
export function parseTimingFunctionString(value: string): CubicBezier | StepsTimingFunction | null {
  // Check for keyword
  if (isEasingKeyword(value)) {
    return [...CSS_EASING_KEYWORDS[value]] as CubicBezier;
  }

  // Parse cubic-bezier(x1, y1, x2, y2)
  const cubicMatch = value.match(
    /^cubic-bezier\s*\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)$/,
  );
  if (cubicMatch) {
    return [
      parseFloat(cubicMatch[1]),
      parseFloat(cubicMatch[2]),
      parseFloat(cubicMatch[3]),
      parseFloat(cubicMatch[4]),
    ] as CubicBezier;
  }

  // Parse steps(n, jumpTerm?) or steps(n)
  const stepsMatch = value.match(
    /^steps\s*\(\s*(\d+)\s*(?:,\s*(jump-start|jump-end|jump-none|jump-both|start|end))?\s*\)$/,
  );
  if (stepsMatch) {
    return {
      type: "steps",
      steps: parseInt(stepsMatch[1], 10),
      jumpTerm: (stepsMatch[2] || "jump-end") as StepsTimingFunction["jumpTerm"],
    };
  }

  // Parse step-start/step-end shortcuts
  if (value === "step-start") {
    return { type: "steps", steps: 1, jumpTerm: "jump-start" };
  }
  if (value === "step-end") {
    return { type: "steps", steps: 1, jumpTerm: "jump-end" };
  }

  return null;
}

/**
 * Normalize a cubic bezier value
 * Clamps X coordinates to [0, 1] range as per CSS spec
 */
export function normalizeCubicBezierValue(
  value: unknown,
  options: { validate?: boolean } = {},
): CubicBezier | StepsTimingFunction | string {
  const { validate = true } = options;

  if (isTokenAlias(value)) {
    return value;
  }

  // Handle easing keywords
  if (isEasingKeyword(value)) {
    return [...CSS_EASING_KEYWORDS[value]] as CubicBezier;
  }

  // Handle string timing functions (cubic-bezier(), steps(), etc.)
  if (typeof value === "string") {
    const parsed = parseTimingFunctionString(value);
    if (parsed) {
      // If it's a steps function, return as-is
      if ("type" in parsed && parsed.type === "steps") {
        return parsed;
      }
      // At this point parsed is CubicBezier (array)
      const bezier = parsed as CubicBezier;
      // If it's cubic-bezier, apply validation/clamping
      if (validate) {
        return [
          Math.max(0, Math.min(1, bezier[0])),
          bezier[1],
          Math.max(0, Math.min(1, bezier[2])),
          bezier[3],
        ] as CubicBezier;
      }
      return bezier;
    }
    throw new Error(
      `Invalid timing function string: "${value}". Expected cubic-bezier(), steps(), or an easing keyword (linear, ease, ease-in, ease-out, ease-in-out).`,
    );
  }

  // Handle steps object
  if (isStepsTimingFunction(value)) {
    return value;
  }

  // Handle cubic-bezier object { type: "cubic-bezier", values: [...] }
  if (isCubicBezierTimingFunction(value)) {
    const v = value.values;
    if (validate) {
      return [
        Math.max(0, Math.min(1, v[0])),
        v[1],
        Math.max(0, Math.min(1, v[2])),
        v[3],
      ] as CubicBezier;
    }
    return [...v] as CubicBezier;
  }

  // Handle raw array
  if (!Array.isArray(value) || value.length !== 4 || value.some((v) => typeof v !== "number")) {
    throw new Error(
      `${JSON.stringify(value)} is not a valid DTFM cubicBezier value (must be an array of 4 numbers [x1, y1, x2, y2], an easing keyword, or a token alias)`,
    );
  }

  if (validate) {
    return [
      Math.max(0, Math.min(1, value[0])),
      value[1],
      Math.max(0, Math.min(1, value[2])),
      value[3],
    ] as CubicBezier;
  }

  return value as CubicBezier;
}

const DEFAULT_EASE: CubicBezier = [0.25, 0.1, 0.25, 1];

/**
 * Normalized transition value
 */
export interface NormalizedTransition {
  duration: string | { value: number; unit: "ms" | "s" };
  delay: string | { value: number; unit: "ms" | "s" };
  timingFunction: CubicBezier | StepsTimingFunction;
  property?: string;
}

/**
 * Normalize a transition value
 *
 * Accepts:
 * - Object with duration, timingFunction, delay (optional), property (optional)
 * - Token alias
 *
 * timingFunction can be:
 * - Array [x1, y1, x2, y2] (cubic-bezier values)
 * - Easing keyword: "linear", "ease", "ease-in", "ease-out", "ease-in-out"
 * - String: "cubic-bezier(0.4, 0, 0.2, 1)" or "steps(4, jump-end)"
 * - Object: { type: "steps", steps: 4, jumpTerm: "jump-end" }
 */
export function normalizeTransitionValue(
  value: unknown,
  options: TransitionNormalizeOptions = {},
): NormalizedTransition | string {
  const { allowExtendedTimingFunctions = true, validateCubicBezier = true } = options;

  if (isTokenAlias(value)) {
    return value;
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(
      `${typeof value} is not a valid DTFM transition value (expected object {duration, timingFunction [, delay, property]} or token alias)`,
    );
  }

  if (!("duration" in value)) {
    throw new Error("duration is required in DTFM transition");
  }

  if (!("timingFunction" in value)) {
    throw new Error("timingFunction is required in DTFM transition");
  }

  const v = value as Transition & { property?: string };

  // Normalize timing function
  let normalizedTimingFunction: CubicBezier | StepsTimingFunction;
  const rawTiming = normalizeCubicBezierValue(v.timingFunction || DEFAULT_EASE, {
    validate: validateCubicBezier,
  });

  if (typeof rawTiming === "string") {
    // It's a token alias, can't normalize further
    throw new Error("Token aliases in timingFunction must be resolved before normalization");
  }

  if ("type" in rawTiming && rawTiming.type === "steps") {
    if (!allowExtendedTimingFunctions) {
      throw new Error(
        "steps() timing function is not allowed. Use allowExtendedTimingFunctions option to enable.",
      );
    }
    normalizedTimingFunction = rawTiming;
  } else {
    normalizedTimingFunction = rawTiming as CubicBezier;
  }

  const result: NormalizedTransition = {
    duration: normalizeDurationValue(v.duration || "0ms"),
    delay: normalizeDurationValue(v.delay || "0ms"),
    timingFunction: normalizedTimingFunction,
  };

  // Add property if specified
  if (v.property && typeof v.property === "string") {
    result.property = v.property;
  }

  return result;
}

/**
 * Convert a timing function to CSS string
 */
export function timingFunctionToCSS(value: CubicBezier | StepsTimingFunction | string): string {
  if (typeof value === "string") {
    return value;
  }

  if ("type" in value && value.type === "steps") {
    return `steps(${value.steps}, ${value.jumpTerm})`;
  }

  // At this point value is CubicBezier (array of 4 numbers)
  const bezier = value as CubicBezier;

  // Check if it matches a keyword
  for (const [keyword, keywordBezier] of Object.entries(CSS_EASING_KEYWORDS)) {
    if (
      bezier[0] === keywordBezier[0] &&
      bezier[1] === keywordBezier[1] &&
      bezier[2] === keywordBezier[2] &&
      bezier[3] === keywordBezier[3]
    ) {
      return keyword;
    }
  }

  return `cubic-bezier(${bezier[0]}, ${bezier[1]}, ${bezier[2]}, ${bezier[3]})`;
}

/**
 * Get easing keyword values
 */
export function getEasingKeywordValues(keyword: CSSEasingKeyword): CubicBezier {
  return [...CSS_EASING_KEYWORDS[keyword]] as CubicBezier;
}

/**
 * Check if a cubic-bezier matches an easing keyword
 */
export function matchEasingKeyword(values: CubicBezier): CSSEasingKeyword | null {
  for (const [keyword, bezier] of Object.entries(CSS_EASING_KEYWORDS)) {
    if (
      Math.abs(values[0] - bezier[0]) < 0.001 &&
      Math.abs(values[1] - bezier[1]) < 0.001 &&
      Math.abs(values[2] - bezier[2]) < 0.001 &&
      Math.abs(values[3] - bezier[3]) < 0.001
    ) {
      return keyword as CSSEasingKeyword;
    }
  }
  return null;
}
