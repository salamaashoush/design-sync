/**
 * Full Schema Validation
 *
 * Complete token file validation following W3C spec.
 */

import { isObject } from "@design-sync/utils";
import { SUPPORTED_TYPES } from "../constants";
import {
  createValidationError,
  TokenValidationError,
  ValidationError,
  ValidationErrorCode,
} from "./errors";
import {
  validateTokenName,
  validateColorValue,
  validateDimensionValue,
  validateDurationValue,
  validateCubicBezierValue,
  validateFontFamilyValue,
  validateFontWeightValue,
  validateStrokeStyleValue,
  validateShadowValue,
  validateBorderValue,
  validateTransitionValue,
  validateGradientValue,
  validateTypographyValue,
  validateDeprecated,
  validateReference,
  isReference,
  type ValidationOptions,
} from "./validators";
import type { TokenType } from "../types";

export interface SchemaValidationOptions extends ValidationOptions {
  /**
   * Throw on validation errors
   * @default false
   */
  throwOnError?: boolean;
  /**
   * Stop at first error
   * @default false
   */
  stopAtFirstError?: boolean;
  /**
   * Validate references exist
   * @default true
   */
  validateReferences?: boolean;
}

export interface SchemaValidationResult {
  valid: boolean;
  errors: ValidationError[];
  tokensCount: number;
  groupsCount: number;
}

/**
 * Validate a value based on its token type
 */
export function validateTokenValue(
  value: unknown,
  type: TokenType,
  path: string,
  options: ValidationOptions = {},
): ValidationError[] {
  switch (type) {
    case "color":
      return validateColorValue(value, path, options);
    case "dimension":
      return validateDimensionValue(value, path, options);
    case "duration":
      return validateDurationValue(value, path, options);
    case "cubicBezier":
      return validateCubicBezierValue(value, path);
    case "fontFamily":
      return validateFontFamilyValue(value, path);
    case "fontWeight":
      return validateFontWeightValue(value, path);
    case "strokeStyle":
      return validateStrokeStyleValue(value, path, options);
    case "shadow":
      return validateShadowValue(value, path, options);
    case "border":
      return validateBorderValue(value, path, options);
    case "transition":
      return validateTransitionValue(value, path, options);
    case "gradient":
      return validateGradientValue(value, path, options);
    case "typography":
      return validateTypographyValue(value, path, options);
    case "number":
      if (!isReference(value) && typeof value !== "number") {
        return [
          createValidationError(
            path,
            ValidationErrorCode.INVALID_VALUE,
            "Number token must have a numeric value",
            "error",
            value,
          ),
        ];
      }
      return isReference(value) ? validateReference(value, path) : [];
    case "link":
      if (!isReference(value) && typeof value !== "string") {
        return [
          createValidationError(
            path,
            ValidationErrorCode.INVALID_VALUE,
            "Link token must have a string value",
            "error",
            value,
          ),
        ];
      }
      return isReference(value) ? validateReference(value, path) : [];
    case "other":
      // "other" type accepts any value
      return [];
    default:
      return [
        createValidationError(
          path,
          ValidationErrorCode.INVALID_TYPE,
          `Unknown token type "${type}"`,
          "error",
          type,
          SUPPORTED_TYPES,
        ),
      ];
  }
}

/**
 * Validate a single token definition
 */
export function validateToken(
  token: unknown,
  path: string,
  inheritedType: TokenType | undefined,
  options: SchemaValidationOptions = {},
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!isObject(token)) {
    errors.push(
      createValidationError(
        path,
        ValidationErrorCode.INVALID_VALUE,
        "Token must be an object",
        "error",
        token,
      ),
    );
    return errors;
  }

  const tokenObj = token as Record<string, unknown>;

  // Validate $value
  if (!("$value" in tokenObj)) {
    errors.push(
      createValidationError(
        path,
        ValidationErrorCode.MISSING_VALUE,
        "Token must have a $value",
        "error",
      ),
    );
    return errors;
  }

  // Determine type - explicit, resolved from reference, or inherited
  let tokenType: TokenType | undefined = tokenObj.$type as TokenType | undefined;

  if (!tokenType && inheritedType) {
    tokenType = inheritedType;
  }

  if (!tokenType) {
    // If value is a reference, we can't validate type here (resolver will handle it)
    if (isReference(tokenObj.$value)) {
      // Skip type validation for aliases - resolver will handle it
      errors.push(...validateReference(tokenObj.$value, `${path}.$value`));
    } else {
      errors.push(
        createValidationError(
          path,
          ValidationErrorCode.MISSING_TYPE,
          "Token must have a $type or inherit one from parent group",
          "error",
        ),
      );
    }
    return errors;
  }

  // Validate type is supported
  if (!SUPPORTED_TYPES.includes(tokenType as (typeof SUPPORTED_TYPES)[number])) {
    errors.push(
      createValidationError(
        `${path}.$type`,
        ValidationErrorCode.INVALID_TYPE,
        `Invalid token type "${tokenType}". Must be one of: ${SUPPORTED_TYPES.join(", ")}`,
        "error",
        tokenType,
        SUPPORTED_TYPES,
      ),
    );
    return errors;
  }

  // Validate $value
  errors.push(...validateTokenValue(tokenObj.$value, tokenType, `${path}.$value`, options));

  // Validate $deprecated if present
  if ("$deprecated" in tokenObj) {
    errors.push(...validateDeprecated(tokenObj.$deprecated, `${path}.$deprecated`));
  }

  return errors;
}

/**
 * Validate a token group
 */
export function validateGroup(
  group: unknown,
  path: string,
  parentType: TokenType | undefined,
  options: SchemaValidationOptions = {},
  stats: { tokens: number; groups: number } = { tokens: 0, groups: 0 },
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!isObject(group)) {
    return errors;
  }

  const groupObj = group as Record<string, unknown>;

  // Get group's $type if present
  const groupType = (groupObj.$type as TokenType) ?? parentType;

  // Validate $extends if present
  if ("$extends" in groupObj) {
    errors.push(...validateReference(groupObj.$extends, `${path}.$extends`));
  }

  // Validate $root if present
  if ("$root" in groupObj && isObject(groupObj.$root)) {
    stats.tokens++;
    errors.push(...validateToken(groupObj.$root, `${path}.$root`, groupType, options));
  }

  // Process children
  for (const [key, value] of Object.entries(groupObj)) {
    // Skip metadata keys
    if (key.startsWith("$")) {
      continue;
    }

    const childPath = path ? `${path}.${key}` : key;

    // Validate token name
    errors.push(...validateTokenName(key, childPath));

    if (options.stopAtFirstError && errors.some((e) => e.severity === "error")) {
      return errors;
    }

    if (!isObject(value)) {
      continue;
    }

    const valueObj = value as Record<string, unknown>;

    // Check if it's a token (has $value)
    if ("$value" in valueObj) {
      stats.tokens++;
      errors.push(...validateToken(valueObj, childPath, groupType, options));
    } else {
      // It's a group
      stats.groups++;
      errors.push(...validateGroup(valueObj, childPath, groupType, options, stats));
    }

    if (options.stopAtFirstError && errors.some((e) => e.severity === "error")) {
      return errors;
    }
  }

  return errors;
}

/**
 * Validate a complete tokens file
 */
export function validateTokensSchema(
  tokens: Record<string, unknown>,
  options: SchemaValidationOptions = {},
): SchemaValidationResult {
  const errors: ValidationError[] = [];
  const stats = { tokens: 0, groups: 0 };

  // Process top-level entries
  for (const [key, value] of Object.entries(tokens)) {
    // Skip top-level metadata
    if (key.startsWith("$")) {
      continue;
    }

    // Validate token name
    errors.push(...validateTokenName(key, key));

    if (options.stopAtFirstError && errors.some((e) => e.severity === "error")) {
      break;
    }

    if (!isObject(value)) {
      continue;
    }

    const valueObj = value as Record<string, unknown>;

    // Check if it's a token or group
    if ("$value" in valueObj) {
      stats.tokens++;
      errors.push(...validateToken(valueObj, key, undefined, options));
    } else {
      stats.groups++;
      errors.push(...validateGroup(valueObj, key, undefined, options, stats));
    }

    if (options.stopAtFirstError && errors.some((e) => e.severity === "error")) {
      break;
    }
  }

  const hasErrors = errors.some((e) => e.severity === "error");

  if (options.throwOnError && hasErrors) {
    throw new TokenValidationError(errors);
  }

  return {
    valid: !hasErrors,
    errors,
    tokensCount: stats.tokens,
    groupsCount: stats.groups,
  };
}

/**
 * Quick validation - returns true/false without details
 */
export function isValidTokensSchema(
  tokens: Record<string, unknown>,
  options: ValidationOptions = {},
): boolean {
  const result = validateTokensSchema(tokens, { ...options, stopAtFirstError: true });
  return result.valid;
}

/**
 * Collect all references from tokens for validation
 */
export function collectReferences(tokens: Record<string, unknown>): Map<string, string[]> {
  const references = new Map<string, string[]>();

  function collectFromValue(value: unknown, path: string): void {
    if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) {
      const refPath = value.slice(1, -1);
      const existing = references.get(refPath) || [];
      existing.push(path);
      references.set(refPath, existing);
    } else if (isObject(value) && "$ref" in value && typeof value.$ref === "string") {
      const refPath = value.$ref.slice(2).replace(/\//g, ".");
      const existing = references.get(refPath) || [];
      existing.push(path);
      references.set(refPath, existing);
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => collectFromValue(v, `${path}[${i}]`));
    } else if (isObject(value)) {
      for (const [k, v] of Object.entries(value)) {
        collectFromValue(v, path ? `${path}.${k}` : k);
      }
    }
  }

  collectFromValue(tokens, "");
  return references;
}

/**
 * Validate that all references point to existing tokens
 */
export function validateReferences(
  tokens: Record<string, unknown>,
  references: Map<string, string[]>,
): ValidationError[] {
  const errors: ValidationError[] = [];
  const tokenPaths = new Set<string>();

  // Collect all token paths
  function collectPaths(obj: Record<string, unknown>, path: string = ""): void {
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith("$")) continue;

      const currentPath = path ? `${path}.${key}` : key;

      if (isObject(value)) {
        if ("$value" in value) {
          tokenPaths.add(currentPath);
        }
        collectPaths(value as Record<string, unknown>, currentPath);
      }
    }
  }

  collectPaths(tokens);

  // Check each reference
  for (const [refPath, usages] of references) {
    if (!tokenPaths.has(refPath)) {
      for (const usage of usages) {
        errors.push(
          createValidationError(
            usage,
            ValidationErrorCode.MISSING_REFERENCE,
            `Reference to "${refPath}" not found`,
            "error",
            refPath,
          ),
        );
      }
    }
  }

  return errors;
}
