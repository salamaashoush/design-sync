import { isObject, isString } from "@design-sync/utils";
import { isTokenAlias } from "../guards";
import type { W3CStrokeStyleObject, W3CStrokeStyleName } from "../types/w3c";
import { isW3CStrokeStyleObject } from "../types/w3c";
import { normalizeDimensionValue } from "./dimension";

const VALID_STROKE_STYLES = [
  "solid",
  "dashed",
  "dotted",
  "double",
  "groove",
  "ridge",
  "outset",
  "inset",
];

const VALID_LINE_CAPS = ["round", "butt", "square"];

/**
 * Normalize a stroke style value
 * Accepts:
 * - W3C object format: { dashArray: [{value: 10, unit: "px"}], lineCap: "round" }
 * - String format: "solid", "dashed", etc.
 */
export function normalizeStrokeStyleValue(
  value: unknown,
): W3CStrokeStyleName | W3CStrokeStyleObject | string {
  if (isTokenAlias(value)) {
    return value;
  }

  // W3C object format
  if (isW3CStrokeStyleObject(value)) {
    const strokeObj = value as W3CStrokeStyleObject;

    // Validate lineCap
    if (!VALID_LINE_CAPS.includes(strokeObj.lineCap)) {
      throw new Error(
        `Invalid lineCap "${strokeObj.lineCap}". Must be one of: ${VALID_LINE_CAPS.join(", ")}`,
      );
    }

    // Normalize dashArray values
    const normalizedDashArray = strokeObj.dashArray.map((dim) => normalizeDimensionValue(dim));

    return {
      dashArray: normalizedDashArray as W3CStrokeStyleObject["dashArray"],
      lineCap: strokeObj.lineCap,
    };
  }

  // Legacy object format (with string dimensions)
  if (isObject(value) && "dashArray" in value && "lineCap" in value) {
    const obj = value as Record<string, unknown>;

    if (!VALID_LINE_CAPS.includes(obj.lineCap as string)) {
      throw new Error(
        `Invalid lineCap "${obj.lineCap}". Must be one of: ${VALID_LINE_CAPS.join(", ")}`,
      );
    }

    if (!Array.isArray(obj.dashArray)) {
      throw new Error("dashArray must be an array of dimension values");
    }

    const normalizedDashArray = obj.dashArray.map((dim: unknown) => normalizeDimensionValue(dim));

    return {
      dashArray: normalizedDashArray as W3CStrokeStyleObject["dashArray"],
      lineCap: obj.lineCap as "round" | "butt" | "square",
    };
  }

  // String format
  if (isString(value) && VALID_STROKE_STYLES.includes(value)) {
    return value as W3CStrokeStyleName;
  }

  throw new Error(
    `${value} is not a valid DTFM stroke style value (must be one of ${VALID_STROKE_STYLES.join(", ")}, an object with {dashArray, lineCap}, or a token alias)`,
  );
}

/**
 * Check if a stroke style is a string value
 */
export function isStrokeStyleString(
  value: W3CStrokeStyleName | W3CStrokeStyleObject | string,
): value is W3CStrokeStyleName {
  return typeof value === "string";
}

/**
 * Check if a stroke style is an object value
 */
export function isStrokeStyleObject(
  value: W3CStrokeStyleName | W3CStrokeStyleObject | string,
): value is W3CStrokeStyleObject {
  return isObject(value) && "dashArray" in value && "lineCap" in value;
}
