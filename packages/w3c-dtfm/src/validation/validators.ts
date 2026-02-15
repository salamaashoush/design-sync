/**
 * Type Validators
 *
 * Validators for each token type following W3C spec.
 */

import { isObject } from "@design-sync/utils";
import type {
  W3CColorSpace,
  W3CColorValue,
  W3CDimensionValue,
  W3CStrokeStyleObject,
  W3CTokenRef,
} from "../types/w3c";
import {
  isW3CColorValue,
  isW3CDimensionValue,
  isW3CDurationValue,
  isW3CTokenRef,
  isW3CStrokeStyleObject,
  W3C_INVALID_TOKEN_NAME_START,
  W3C_INVALID_TOKEN_NAME_CHARS,
} from "../types/w3c";
import {
  isLegacyColor,
  isLegacyDimension,
  isLegacyDuration,
  isLegacyTokenAlias,
} from "../types/legacy";
import { createValidationError, type ValidationError, ValidationErrorCode } from "./errors";

/**
 * All valid W3C color spaces
 */
export const VALID_COLOR_SPACES: W3CColorSpace[] = [
  "srgb",
  "srgb-linear",
  "hsl",
  "hwb",
  "lab",
  "lch",
  "oklab",
  "oklch",
  "display-p3",
  "a98-rgb",
  "prophoto-rgb",
  "rec2020",
  "xyz-d50",
  "xyz-d65",
];

/**
 * Valid stroke style names
 */
export const VALID_STROKE_STYLES = [
  "solid",
  "dashed",
  "dotted",
  "double",
  "groove",
  "ridge",
  "inset",
  "outset",
];

/**
 * Valid font weight names
 */
export const VALID_FONT_WEIGHT_NAMES = [
  "thin",
  "hairline",
  "extra-light",
  "ultra-light",
  "light",
  "normal",
  "regular",
  "book",
  "medium",
  "semi-bold",
  "demi-bold",
  "bold",
  "extra-bold",
  "ultra-bold",
  "black",
  "heavy",
  "extra-black",
  "ultra-black",
];

export interface ValidationOptions {
  /**
   * Allow legacy format values
   * @default true
   */
  allowLegacy?: boolean;
  /**
   * Strict mode - treat warnings as errors
   * @default false
   */
  strict?: boolean;
}

/**
 * Validate a token name per W3C spec
 */
export function validateTokenName(name: string, path: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (name.startsWith(W3C_INVALID_TOKEN_NAME_START)) {
    errors.push(
      createValidationError(
        path,
        ValidationErrorCode.INVALID_TOKEN_NAME_START,
        `Token name cannot start with "${W3C_INVALID_TOKEN_NAME_START}"`,
        "error",
        name,
      ),
    );
  }

  for (const char of W3C_INVALID_TOKEN_NAME_CHARS) {
    if (name.includes(char)) {
      errors.push(
        createValidationError(
          path,
          ValidationErrorCode.INVALID_TOKEN_NAME_CHAR,
          `Token name cannot contain "${char}"`,
          "error",
          name,
        ),
      );
    }
  }

  return errors;
}

/**
 * Validate a color value
 */
export function validateColorValue(
  value: unknown,
  path: string,
  options: ValidationOptions = {},
): ValidationError[] {
  const errors: ValidationError[] = [];
  const { allowLegacy = true } = options;

  if (isReference(value)) {
    return validateReference(value, path);
  }

  // Check for W3C format
  if (isW3CColorValue(value)) {
    const colorValue = value as W3CColorValue;

    // Validate color space
    if (!VALID_COLOR_SPACES.includes(colorValue.colorSpace)) {
      errors.push(
        createValidationError(
          `${path}.colorSpace`,
          ValidationErrorCode.INVALID_COLOR_SPACE,
          `Invalid color space "${colorValue.colorSpace}". Must be one of: ${VALID_COLOR_SPACES.join(", ")}`,
          "error",
          colorValue.colorSpace,
          VALID_COLOR_SPACES,
        ),
      );
    }

    // Validate components
    if (!Array.isArray(colorValue.components) || colorValue.components.length !== 3) {
      errors.push(
        createValidationError(
          `${path}.components`,
          ValidationErrorCode.INVALID_COLOR_COMPONENTS,
          "Color components must be an array of 3 values",
          "error",
          colorValue.components,
        ),
      );
    } else {
      for (let i = 0; i < 3; i++) {
        const component = colorValue.components[i];
        if (component !== "none" && typeof component !== "number") {
          errors.push(
            createValidationError(
              `${path}.components[${i}]`,
              ValidationErrorCode.INVALID_COLOR_COMPONENTS,
              `Color component must be a number or "none", got ${typeof component}`,
              "error",
              component,
            ),
          );
        }
      }
    }

    // Validate alpha if present
    if (colorValue.alpha !== undefined) {
      if (colorValue.alpha !== "none" && typeof colorValue.alpha !== "number") {
        errors.push(
          createValidationError(
            `${path}.alpha`,
            ValidationErrorCode.INVALID_COLOR_VALUE,
            `Alpha must be a number or "none", got ${typeof colorValue.alpha}`,
            "error",
            colorValue.alpha,
          ),
        );
      }
    }

    return errors;
  }

  // Check for legacy format
  if (isLegacyColor(value)) {
    if (!allowLegacy) {
      errors.push(
        createValidationError(
          path,
          ValidationErrorCode.INVALID_COLOR_VALUE,
          "Legacy hex color format not allowed. Use W3C color object format.",
          "error",
          value,
        ),
      );
    }
    return errors;
  }

  errors.push(
    createValidationError(
      path,
      ValidationErrorCode.INVALID_COLOR_VALUE,
      `Invalid color value. Expected W3C color object ${allowLegacy ? "or hex string" : ""}`,
      "error",
      value,
    ),
  );

  return errors;
}

/**
 * Validate a dimension value
 */
export function validateDimensionValue(
  value: unknown,
  path: string,
  options: ValidationOptions = {},
): ValidationError[] {
  const errors: ValidationError[] = [];
  const { allowLegacy = true } = options;

  if (isReference(value)) {
    return validateReference(value, path);
  }

  // Check for W3C format
  if (isW3CDimensionValue(value)) {
    const dimValue = value as W3CDimensionValue;

    if (typeof dimValue.value !== "number") {
      errors.push(
        createValidationError(
          `${path}.value`,
          ValidationErrorCode.INVALID_DIMENSION_VALUE,
          `Dimension value must be a number, got ${typeof dimValue.value}`,
          "error",
          dimValue.value,
        ),
      );
    }

    if (dimValue.unit !== "px" && dimValue.unit !== "rem") {
      errors.push(
        createValidationError(
          `${path}.unit`,
          ValidationErrorCode.INVALID_DIMENSION_VALUE,
          `Dimension unit must be "px" or "rem", got "${dimValue.unit}"`,
          "error",
          dimValue.unit,
        ),
      );
    }

    return errors;
  }

  // Check for legacy format
  if (isLegacyDimension(value)) {
    if (!allowLegacy) {
      errors.push(
        createValidationError(
          path,
          ValidationErrorCode.INVALID_DIMENSION_VALUE,
          "Legacy dimension string format not allowed. Use W3C dimension object format.",
          "error",
          value,
        ),
      );
    }
    return errors;
  }

  errors.push(
    createValidationError(
      path,
      ValidationErrorCode.INVALID_DIMENSION_VALUE,
      `Invalid dimension value. Expected W3C dimension object ${allowLegacy ? 'or string like "10px"' : ""}`,
      "error",
      value,
    ),
  );

  return errors;
}

/**
 * Validate a duration value
 */
export function validateDurationValue(
  value: unknown,
  path: string,
  options: ValidationOptions = {},
): ValidationError[] {
  const errors: ValidationError[] = [];
  const { allowLegacy = true } = options;

  if (isReference(value)) {
    return validateReference(value, path);
  }

  // Check for W3C format
  if (isW3CDurationValue(value)) {
    const durValue = value;

    if (typeof durValue.value !== "number") {
      errors.push(
        createValidationError(
          `${path}.value`,
          ValidationErrorCode.INVALID_DURATION_VALUE,
          `Duration value must be a number, got ${typeof durValue.value}`,
          "error",
          durValue.value,
        ),
      );
    }

    if (durValue.unit !== "ms" && durValue.unit !== "s") {
      errors.push(
        createValidationError(
          `${path}.unit`,
          ValidationErrorCode.INVALID_DURATION_VALUE,
          `Duration unit must be "ms" or "s", got "${durValue.unit}"`,
          "error",
          durValue.unit,
        ),
      );
    }

    return errors;
  }

  // Check for legacy format
  if (isLegacyDuration(value)) {
    if (!allowLegacy) {
      errors.push(
        createValidationError(
          path,
          ValidationErrorCode.INVALID_DURATION_VALUE,
          "Legacy duration string format not allowed. Use W3C duration object format.",
          "error",
          value,
        ),
      );
    }
    return errors;
  }

  errors.push(
    createValidationError(
      path,
      ValidationErrorCode.INVALID_DURATION_VALUE,
      `Invalid duration value. Expected W3C duration object ${allowLegacy ? 'or string like "500ms"' : ""}`,
      "error",
      value,
    ),
  );

  return errors;
}

/**
 * Validate a cubic bezier value
 */
export function validateCubicBezierValue(value: unknown, path: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (isReference(value)) {
    return validateReference(value, path);
  }

  if (!Array.isArray(value) || value.length !== 4) {
    errors.push(
      createValidationError(
        path,
        ValidationErrorCode.INVALID_CUBIC_BEZIER_VALUE,
        "Cubic bezier must be an array of 4 numbers",
        "error",
        value,
      ),
    );
    return errors;
  }

  for (let i = 0; i < 4; i++) {
    if (typeof value[i] !== "number") {
      errors.push(
        createValidationError(
          `${path}[${i}]`,
          ValidationErrorCode.INVALID_CUBIC_BEZIER_VALUE,
          `Cubic bezier value must be a number, got ${typeof value[i]}`,
          "error",
          value[i],
        ),
      );
    }

    // X values (index 0 and 2) must be between 0 and 1
    if ((i === 0 || i === 2) && typeof value[i] === "number" && (value[i] < 0 || value[i] > 1)) {
      errors.push(
        createValidationError(
          `${path}[${i}]`,
          ValidationErrorCode.INVALID_CUBIC_BEZIER_VALUE,
          `Cubic bezier X value must be between 0 and 1, got ${value[i]}`,
          "warning",
          value[i],
        ),
      );
    }
  }

  return errors;
}

/**
 * Validate a font family value
 */
export function validateFontFamilyValue(value: unknown, path: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (isReference(value)) {
    return validateReference(value, path);
  }

  if (typeof value === "string") {
    if (value.trim().length === 0) {
      errors.push(
        createValidationError(
          path,
          ValidationErrorCode.INVALID_FONT_FAMILY_VALUE,
          "Font family cannot be empty",
          "error",
          value,
        ),
      );
    }
    return errors;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      errors.push(
        createValidationError(
          path,
          ValidationErrorCode.INVALID_FONT_FAMILY_VALUE,
          "Font family array cannot be empty",
          "error",
          value,
        ),
      );
    }

    for (let i = 0; i < value.length; i++) {
      if (typeof value[i] !== "string") {
        errors.push(
          createValidationError(
            `${path}[${i}]`,
            ValidationErrorCode.INVALID_FONT_FAMILY_VALUE,
            `Font family must be a string, got ${typeof value[i]}`,
            "error",
            value[i],
          ),
        );
      }
    }
    return errors;
  }

  errors.push(
    createValidationError(
      path,
      ValidationErrorCode.INVALID_FONT_FAMILY_VALUE,
      "Font family must be a string or array of strings",
      "error",
      value,
    ),
  );

  return errors;
}

/**
 * Validate a font weight value
 */
export function validateFontWeightValue(value: unknown, path: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (isReference(value)) {
    return validateReference(value, path);
  }

  if (typeof value === "number") {
    if (value < 1 || value > 1000) {
      errors.push(
        createValidationError(
          path,
          ValidationErrorCode.INVALID_FONT_WEIGHT_VALUE,
          `Font weight number must be between 1 and 1000, got ${value}`,
          "error",
          value,
        ),
      );
    }
    return errors;
  }

  if (typeof value === "string") {
    // Check if it's a valid weight name or number string
    if (!VALID_FONT_WEIGHT_NAMES.includes(value) && !/^[1-9]00$/.test(value) && value !== "950") {
      errors.push(
        createValidationError(
          path,
          ValidationErrorCode.INVALID_FONT_WEIGHT_VALUE,
          `Invalid font weight "${value}". Must be a number 1-1000 or one of: ${VALID_FONT_WEIGHT_NAMES.join(", ")}`,
          "error",
          value,
        ),
      );
    }
    return errors;
  }

  errors.push(
    createValidationError(
      path,
      ValidationErrorCode.INVALID_FONT_WEIGHT_VALUE,
      "Font weight must be a number or valid weight name",
      "error",
      value,
    ),
  );

  return errors;
}

/**
 * Validate a stroke style value
 */
export function validateStrokeStyleValue(
  value: unknown,
  path: string,
  options: ValidationOptions = {},
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (isReference(value)) {
    return validateReference(value, path);
  }

  // String form
  if (typeof value === "string") {
    if (!VALID_STROKE_STYLES.includes(value)) {
      errors.push(
        createValidationError(
          path,
          ValidationErrorCode.INVALID_STROKE_STYLE_VALUE,
          `Invalid stroke style "${value}". Must be one of: ${VALID_STROKE_STYLES.join(", ")}`,
          "error",
          value,
        ),
      );
    }
    return errors;
  }

  // Object form (W3C)
  if (isW3CStrokeStyleObject(value)) {
    const strokeObj = value as W3CStrokeStyleObject;

    if (!["round", "butt", "square"].includes(strokeObj.lineCap)) {
      errors.push(
        createValidationError(
          `${path}.lineCap`,
          ValidationErrorCode.INVALID_STROKE_STYLE_VALUE,
          `Invalid lineCap "${strokeObj.lineCap}". Must be "round", "butt", or "square"`,
          "error",
          strokeObj.lineCap,
        ),
      );
    }

    if (!Array.isArray(strokeObj.dashArray)) {
      errors.push(
        createValidationError(
          `${path}.dashArray`,
          ValidationErrorCode.INVALID_STROKE_STYLE_VALUE,
          "dashArray must be an array of dimensions",
          "error",
          strokeObj.dashArray,
        ),
      );
    } else {
      for (let i = 0; i < strokeObj.dashArray.length; i++) {
        errors.push(
          ...validateDimensionValue(strokeObj.dashArray[i], `${path}.dashArray[${i}]`, options),
        );
      }
    }

    return errors;
  }

  errors.push(
    createValidationError(
      path,
      ValidationErrorCode.INVALID_STROKE_STYLE_VALUE,
      "Stroke style must be a valid style name or object with dashArray and lineCap",
      "error",
      value,
    ),
  );

  return errors;
}

/**
 * Validate a shadow value
 */
export function validateShadowValue(
  value: unknown,
  path: string,
  options: ValidationOptions = {},
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (isReference(value)) {
    return validateReference(value, path);
  }

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      errors.push(...validateSingleShadow(value[i], `${path}[${i}]`, options));
    }
    return errors;
  }

  return validateSingleShadow(value, path, options);
}

function validateSingleShadow(
  value: unknown,
  path: string,
  options: ValidationOptions = {},
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!isObject(value)) {
    errors.push(
      createValidationError(
        path,
        ValidationErrorCode.INVALID_SHADOW_VALUE,
        "Shadow must be an object",
        "error",
        value,
      ),
    );
    return errors;
  }

  const shadow = value as Record<string, unknown>;

  // Required properties
  if (!("color" in shadow)) {
    errors.push(
      createValidationError(
        path,
        ValidationErrorCode.INVALID_SHADOW_VALUE,
        "Shadow must have a color",
        "error",
      ),
    );
  } else {
    errors.push(...validateColorValue(shadow.color, `${path}.color`, options));
  }

  if (!("offsetX" in shadow)) {
    errors.push(
      createValidationError(
        path,
        ValidationErrorCode.INVALID_SHADOW_VALUE,
        "Shadow must have an offsetX",
        "error",
      ),
    );
  } else {
    errors.push(...validateDimensionValue(shadow.offsetX, `${path}.offsetX`, options));
  }

  if (!("offsetY" in shadow)) {
    errors.push(
      createValidationError(
        path,
        ValidationErrorCode.INVALID_SHADOW_VALUE,
        "Shadow must have an offsetY",
        "error",
      ),
    );
  } else {
    errors.push(...validateDimensionValue(shadow.offsetY, `${path}.offsetY`, options));
  }

  if (!("blur" in shadow)) {
    errors.push(
      createValidationError(
        path,
        ValidationErrorCode.INVALID_SHADOW_VALUE,
        "Shadow must have a blur",
        "error",
      ),
    );
  } else {
    errors.push(...validateDimensionValue(shadow.blur, `${path}.blur`, options));
  }

  if (!("spread" in shadow)) {
    errors.push(
      createValidationError(
        path,
        ValidationErrorCode.INVALID_SHADOW_VALUE,
        "Shadow must have a spread",
        "error",
      ),
    );
  } else {
    errors.push(...validateDimensionValue(shadow.spread, `${path}.spread`, options));
  }

  return errors;
}

/**
 * Validate a border value
 */
export function validateBorderValue(
  value: unknown,
  path: string,
  options: ValidationOptions = {},
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (isReference(value)) {
    return validateReference(value, path);
  }

  if (!isObject(value)) {
    errors.push(
      createValidationError(
        path,
        ValidationErrorCode.INVALID_BORDER_VALUE,
        "Border must be an object",
        "error",
        value,
      ),
    );
    return errors;
  }

  const border = value as Record<string, unknown>;

  if (!("width" in border)) {
    errors.push(
      createValidationError(
        path,
        ValidationErrorCode.INVALID_BORDER_VALUE,
        "Border must have a width",
        "error",
      ),
    );
  } else {
    errors.push(...validateDimensionValue(border.width, `${path}.width`, options));
  }

  if (!("style" in border)) {
    errors.push(
      createValidationError(
        path,
        ValidationErrorCode.INVALID_BORDER_VALUE,
        "Border must have a style",
        "error",
      ),
    );
  } else {
    errors.push(...validateStrokeStyleValue(border.style, `${path}.style`, options));
  }

  if (!("color" in border)) {
    errors.push(
      createValidationError(
        path,
        ValidationErrorCode.INVALID_BORDER_VALUE,
        "Border must have a color",
        "error",
      ),
    );
  } else {
    errors.push(...validateColorValue(border.color, `${path}.color`, options));
  }

  return errors;
}

/**
 * Validate a transition value
 */
export function validateTransitionValue(
  value: unknown,
  path: string,
  options: ValidationOptions = {},
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (isReference(value)) {
    return validateReference(value, path);
  }

  if (!isObject(value)) {
    errors.push(
      createValidationError(
        path,
        ValidationErrorCode.INVALID_TRANSITION_VALUE,
        "Transition must be an object",
        "error",
        value,
      ),
    );
    return errors;
  }

  const transition = value as Record<string, unknown>;

  if (!("duration" in transition)) {
    errors.push(
      createValidationError(
        path,
        ValidationErrorCode.INVALID_TRANSITION_VALUE,
        "Transition must have a duration",
        "error",
      ),
    );
  } else {
    errors.push(...validateDurationValue(transition.duration, `${path}.duration`, options));
  }

  if ("delay" in transition) {
    errors.push(...validateDurationValue(transition.delay, `${path}.delay`, options));
  }

  if (!("timingFunction" in transition)) {
    errors.push(
      createValidationError(
        path,
        ValidationErrorCode.INVALID_TRANSITION_VALUE,
        "Transition must have a timingFunction",
        "error",
      ),
    );
  } else {
    errors.push(...validateCubicBezierValue(transition.timingFunction, `${path}.timingFunction`));
  }

  return errors;
}

/**
 * Validate a gradient value
 */
export function validateGradientValue(
  value: unknown,
  path: string,
  options: ValidationOptions = {},
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (isReference(value)) {
    return validateReference(value, path);
  }

  if (!Array.isArray(value)) {
    errors.push(
      createValidationError(
        path,
        ValidationErrorCode.INVALID_GRADIENT_VALUE,
        "Gradient must be an array of stops",
        "error",
        value,
      ),
    );
    return errors;
  }

  for (let i = 0; i < value.length; i++) {
    const stop = value[i];
    if (!isObject(stop)) {
      errors.push(
        createValidationError(
          `${path}[${i}]`,
          ValidationErrorCode.INVALID_GRADIENT_VALUE,
          "Gradient stop must be an object",
          "error",
          stop,
        ),
      );
      continue;
    }

    if (!("color" in stop)) {
      errors.push(
        createValidationError(
          `${path}[${i}]`,
          ValidationErrorCode.INVALID_GRADIENT_VALUE,
          "Gradient stop must have a color",
          "error",
        ),
      );
    } else {
      errors.push(...validateColorValue(stop.color, `${path}[${i}].color`, options));
    }

    if (!("position" in stop)) {
      errors.push(
        createValidationError(
          `${path}[${i}]`,
          ValidationErrorCode.INVALID_GRADIENT_VALUE,
          "Gradient stop must have a position",
          "error",
        ),
      );
    } else if (!isReference(stop.position) && typeof stop.position !== "number") {
      errors.push(
        createValidationError(
          `${path}[${i}].position`,
          ValidationErrorCode.INVALID_GRADIENT_VALUE,
          "Gradient position must be a number",
          "error",
          stop.position,
        ),
      );
    }
  }

  return errors;
}

/**
 * Validate a typography value
 */
export function validateTypographyValue(
  value: unknown,
  path: string,
  options: ValidationOptions = {},
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (isReference(value)) {
    return validateReference(value, path);
  }

  if (!isObject(value)) {
    errors.push(
      createValidationError(
        path,
        ValidationErrorCode.INVALID_TYPOGRAPHY_VALUE,
        "Typography must be an object",
        "error",
        value,
      ),
    );
    return errors;
  }

  const typography = value as Record<string, unknown>;

  if ("fontFamily" in typography) {
    errors.push(...validateFontFamilyValue(typography.fontFamily, `${path}.fontFamily`));
  }

  if ("fontSize" in typography) {
    errors.push(...validateDimensionValue(typography.fontSize, `${path}.fontSize`, options));
  }

  if ("fontWeight" in typography) {
    errors.push(...validateFontWeightValue(typography.fontWeight, `${path}.fontWeight`));
  }

  if ("letterSpacing" in typography) {
    errors.push(
      ...validateDimensionValue(typography.letterSpacing, `${path}.letterSpacing`, options),
    );
  }

  if (
    "lineHeight" in typography &&
    !isReference(typography.lineHeight) &&
    typeof typography.lineHeight !== "number"
  ) {
    errors.push(
      createValidationError(
        `${path}.lineHeight`,
        ValidationErrorCode.INVALID_TYPOGRAPHY_VALUE,
        "lineHeight must be a number",
        "error",
        typography.lineHeight,
      ),
    );
  }

  return errors;
}

/**
 * Check if a value is a reference (alias or $ref)
 */
export function isReference(value: unknown): boolean {
  return isLegacyTokenAlias(value) || isW3CTokenRef(value);
}

/**
 * Validate a reference value
 */
export function validateReference(value: unknown, path: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (isW3CTokenRef(value)) {
    const ref = value as W3CTokenRef;
    if (!ref.$ref.startsWith("#/")) {
      errors.push(
        createValidationError(
          path,
          ValidationErrorCode.INVALID_REFERENCE,
          '$ref must start with "#/"',
          "error",
          ref.$ref,
        ),
      );
    }
    return errors;
  }

  if (isLegacyTokenAlias(value)) {
    // Valid legacy alias
    return errors;
  }

  errors.push(
    createValidationError(
      path,
      ValidationErrorCode.INVALID_REFERENCE,
      "Invalid reference format",
      "error",
      value,
    ),
  );

  return errors;
}

/**
 * Validate the $deprecated property
 */
export function validateDeprecated(value: unknown, path: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (value === undefined) {
    return errors;
  }

  if (typeof value !== "boolean" && typeof value !== "string") {
    errors.push(
      createValidationError(
        path,
        ValidationErrorCode.INVALID_DEPRECATED,
        "$deprecated must be a boolean or string",
        "error",
        value,
      ),
    );
  }

  return errors;
}
