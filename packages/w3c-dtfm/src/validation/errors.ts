/**
 * Validation Error Types
 *
 * Error types for token validation.
 */

export type ValidationSeverity = "error" | "warning" | "info";

export interface ValidationError {
  path: string;
  message: string;
  severity: ValidationSeverity;
  code: ValidationErrorCode;
  actual?: unknown;
  expected?: unknown;
}

export enum ValidationErrorCode {
  // Token name errors
  INVALID_TOKEN_NAME_START = "INVALID_TOKEN_NAME_START",
  INVALID_TOKEN_NAME_CHAR = "INVALID_TOKEN_NAME_CHAR",

  // Value errors
  INVALID_VALUE = "INVALID_VALUE",
  INVALID_COLOR_VALUE = "INVALID_COLOR_VALUE",
  INVALID_DIMENSION_VALUE = "INVALID_DIMENSION_VALUE",
  INVALID_DURATION_VALUE = "INVALID_DURATION_VALUE",
  INVALID_CUBIC_BEZIER_VALUE = "INVALID_CUBIC_BEZIER_VALUE",
  INVALID_FONT_FAMILY_VALUE = "INVALID_FONT_FAMILY_VALUE",
  INVALID_FONT_WEIGHT_VALUE = "INVALID_FONT_WEIGHT_VALUE",
  INVALID_STROKE_STYLE_VALUE = "INVALID_STROKE_STYLE_VALUE",
  INVALID_SHADOW_VALUE = "INVALID_SHADOW_VALUE",
  INVALID_BORDER_VALUE = "INVALID_BORDER_VALUE",
  INVALID_TRANSITION_VALUE = "INVALID_TRANSITION_VALUE",
  INVALID_GRADIENT_VALUE = "INVALID_GRADIENT_VALUE",
  INVALID_TYPOGRAPHY_VALUE = "INVALID_TYPOGRAPHY_VALUE",

  // Color space errors
  INVALID_COLOR_SPACE = "INVALID_COLOR_SPACE",
  INVALID_COLOR_COMPONENTS = "INVALID_COLOR_COMPONENTS",

  // Reference errors
  INVALID_REFERENCE = "INVALID_REFERENCE",
  CIRCULAR_REFERENCE = "CIRCULAR_REFERENCE",
  MISSING_REFERENCE = "MISSING_REFERENCE",

  // Type errors
  MISSING_TYPE = "MISSING_TYPE",
  INVALID_TYPE = "INVALID_TYPE",
  TYPE_MISMATCH = "TYPE_MISMATCH",

  // Structure errors
  MISSING_VALUE = "MISSING_VALUE",
  INVALID_EXTENSION = "INVALID_EXTENSION",
  INVALID_DEPRECATED = "INVALID_DEPRECATED",

  // Group errors
  INVALID_EXTENDS = "INVALID_EXTENDS",
  INVALID_ROOT = "INVALID_ROOT",

  // General
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export class TokenValidationError extends Error {
  public readonly errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    const errorMessages = errors
      .filter((e) => e.severity === "error")
      .map((e) => `${e.path}: ${e.message}`);
    super(
      `Token validation failed with ${errorMessages.length} error(s):\n${errorMessages.join("\n")}`,
    );
    this.name = "TokenValidationError";
    this.errors = errors;
  }

  hasErrors(): boolean {
    return this.errors.some((e) => e.severity === "error");
  }

  hasWarnings(): boolean {
    return this.errors.some((e) => e.severity === "warning");
  }

  getErrors(): ValidationError[] {
    return this.errors.filter((e) => e.severity === "error");
  }

  getWarnings(): ValidationError[] {
    return this.errors.filter((e) => e.severity === "warning");
  }
}

/**
 * Create a validation error
 */
export function createValidationError(
  path: string,
  code: ValidationErrorCode,
  message: string,
  severity: ValidationSeverity = "error",
  actual?: unknown,
  expected?: unknown,
): ValidationError {
  return { path, code, message, severity, actual, expected };
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  const groupedBySeverity = {
    error: errors.filter((e) => e.severity === "error"),
    warning: errors.filter((e) => e.severity === "warning"),
    info: errors.filter((e) => e.severity === "info"),
  };

  const lines: string[] = [];

  if (groupedBySeverity.error.length > 0) {
    lines.push(`Errors (${groupedBySeverity.error.length}):`);
    for (const err of groupedBySeverity.error) {
      lines.push(`  ✗ ${err.path}: ${err.message} [${err.code}]`);
    }
  }

  if (groupedBySeverity.warning.length > 0) {
    lines.push(`Warnings (${groupedBySeverity.warning.length}):`);
    for (const warn of groupedBySeverity.warning) {
      lines.push(`  ⚠ ${warn.path}: ${warn.message} [${warn.code}]`);
    }
  }

  if (groupedBySeverity.info.length > 0) {
    lines.push(`Info (${groupedBySeverity.info.length}):`);
    for (const info of groupedBySeverity.info) {
      lines.push(`  ℹ ${info.path}: ${info.message} [${info.code}]`);
    }
  }

  return lines.join("\n");
}
