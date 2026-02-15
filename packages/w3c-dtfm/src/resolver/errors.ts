/**
 * Resolver Error Types
 *
 * Error types specific to the token resolution process.
 */

export class ResolverError extends Error {
  public readonly path: string;
  public readonly code: ResolverErrorCode;
  public readonly details?: unknown;

  constructor(message: string, path: string, code: ResolverErrorCode, details?: unknown) {
    super(message);
    this.name = "ResolverError";
    this.path = path;
    this.code = code;
    this.details = details;
  }
}

export enum ResolverErrorCode {
  // Reference errors
  CIRCULAR_REFERENCE = "CIRCULAR_REFERENCE",
  MISSING_REFERENCE = "MISSING_REFERENCE",
  INVALID_REFERENCE_FORMAT = "INVALID_REFERENCE_FORMAT",

  // Type errors
  TYPE_MISMATCH = "TYPE_MISMATCH",
  MISSING_TYPE = "MISSING_TYPE",
  CANNOT_INFER_TYPE = "CANNOT_INFER_TYPE",

  // Validation errors
  INVALID_VALUE = "INVALID_VALUE",

  // Graph errors
  DEPENDENCY_CYCLE = "DEPENDENCY_CYCLE",
  UNRESOLVED_DEPENDENCY = "UNRESOLVED_DEPENDENCY",
}

export class CircularReferenceError extends ResolverError {
  public readonly cycle: string[];

  constructor(path: string, cycle: string[]) {
    super(
      `Circular reference detected at "${path}": ${cycle.join(" -> ")}`,
      path,
      ResolverErrorCode.CIRCULAR_REFERENCE,
      {
        cycle,
      },
    );
    this.name = "CircularReferenceError";
    this.cycle = cycle;
  }
}

export class MissingReferenceError extends ResolverError {
  public readonly referencePath: string;

  constructor(path: string, referencePath: string) {
    super(
      `Reference to "${referencePath}" not found at "${path}"`,
      path,
      ResolverErrorCode.MISSING_REFERENCE,
      { referencePath },
    );
    this.name = "MissingReferenceError";
    this.referencePath = referencePath;
  }
}

export class TypeMismatchError extends ResolverError {
  public readonly expectedType: string;
  public readonly actualType: string;

  constructor(path: string, expectedType: string, actualType: string) {
    super(
      `Type mismatch at "${path}": expected "${expectedType}", got "${actualType}"`,
      path,
      ResolverErrorCode.TYPE_MISMATCH,
      { expectedType, actualType },
    );
    this.name = "TypeMismatchError";
    this.expectedType = expectedType;
    this.actualType = actualType;
  }
}

export class CannotInferTypeError extends ResolverError {
  constructor(path: string) {
    super(
      `Cannot infer type at "${path}": no explicit $type, no inherited type from parent, and value is not a reference`,
      path,
      ResolverErrorCode.CANNOT_INFER_TYPE,
    );
    this.name = "CannotInferTypeError";
  }
}

export interface ResolverWarning {
  path: string;
  message: string;
  code: string;
}

export interface ResolverResult<T = unknown> {
  success: boolean;
  value?: T;
  errors: ResolverError[];
  warnings: ResolverWarning[];
}
