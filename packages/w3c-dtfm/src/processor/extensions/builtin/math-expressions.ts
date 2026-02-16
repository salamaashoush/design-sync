import type { DesignToken } from "../../../types";
import type { ProcessorExtension, SchemaExtensionContext } from "../../types";

export interface MathExpressionsOptions {
  /** Token types to process. Default: ["dimension", "number"] */
  types?: string[];
}

export interface MathExpressionMetadata {
  /** The original expression before evaluation */
  expression: string;
  /** Whether the expression contains token references */
  hasRefs: boolean;
  /** Per-mode expressions if modes use different expressions */
  modeExpressions?: Record<string, string>;
}

/**
 * Simple recursive-descent parser for math expressions in token values.
 * Supports: +, -, *, /, parentheses, token references via {token.ref}.
 * Resolves token refs via resolveRef callback and extracts numeric parts.
 */
function parseMathExpression(
  input: string,
  resolveRef: (ref: string) => number | undefined,
): { value: number; unit: string } | undefined {
  let pos = 0;

  function skipWhitespace() {
    while (pos < input.length && input[pos] === " ") pos++;
  }

  function parseNumber(): { value: number; unit: string } | undefined {
    skipWhitespace();
    const start = pos;

    // Check for token reference
    if (input[pos] === "{") {
      const end = input.indexOf("}", pos);
      if (end === -1) return undefined;
      const ref = input.slice(pos + 1, end);
      pos = end + 1;
      const resolved = resolveRef(ref);
      if (resolved === undefined) return undefined;
      return { value: resolved, unit: "" };
    }

    // Parse numeric literal with optional unit
    let numStr = "";
    if (input[pos] === "-" || input[pos] === "+") {
      numStr += input[pos++];
    }
    while (pos < input.length && ((input[pos] >= "0" && input[pos] <= "9") || input[pos] === ".")) {
      numStr += input[pos++];
    }
    if (numStr === "" || numStr === "-" || numStr === "+") {
      pos = start;
      return undefined;
    }

    // Extract unit
    let unit = "";
    while (
      pos < input.length &&
      input[pos] !== " " &&
      input[pos] !== "+" &&
      input[pos] !== "-" &&
      input[pos] !== "*" &&
      input[pos] !== "/" &&
      input[pos] !== ")"
    ) {
      unit += input[pos++];
    }

    return { value: parseFloat(numStr), unit };
  }

  function parseParenthesized(): { value: number; unit: string } | undefined {
    skipWhitespace();
    if (pos < input.length && input[pos] === "(") {
      pos++; // skip (
      const result = parseAddition();
      skipWhitespace();
      if (pos < input.length && input[pos] === ")") {
        pos++; // skip )
      }
      return result;
    }
    return parseNumber();
  }

  function parseMultiplication(): { value: number; unit: string } | undefined {
    let left = parseParenthesized();
    if (!left) return undefined;

    while (pos < input.length) {
      skipWhitespace();
      const op = input[pos];
      if (op !== "*" && op !== "/") break;
      pos++;
      const right = parseParenthesized();
      if (!right) return undefined;

      if (op === "*") {
        left = { value: left.value * right.value, unit: left.unit || right.unit };
      } else {
        if (right.value === 0) return undefined;
        left = { value: left.value / right.value, unit: left.unit || right.unit };
      }
    }

    return left;
  }

  function parseAddition(): { value: number; unit: string } | undefined {
    let left = parseMultiplication();
    if (!left) return undefined;

    while (pos < input.length) {
      skipWhitespace();
      const op = input[pos];
      if (op !== "+" && op !== "-") break;
      pos++;
      const right = parseMultiplication();
      if (!right) return undefined;

      // Check unit consistency for addition/subtraction
      if (left.unit && right.unit && left.unit !== right.unit) {
        return undefined; // Mixed units in addition — can't resolve
      }

      if (op === "+") {
        left = { value: left.value + right.value, unit: left.unit || right.unit };
      } else {
        left = { value: left.value - right.value, unit: left.unit || right.unit };
      }
    }

    return left;
  }

  const result = parseAddition();
  skipWhitespace();

  // Must consume all input
  if (pos !== input.length) return undefined;
  return result;
}

function hasMathOperator(value: string): boolean {
  // Check if the value contains math operators outside of token references
  let inRef = false;
  for (let i = 0; i < value.length; i++) {
    if (value[i] === "{") inRef = true;
    if (value[i] === "}") inRef = false;
    if (!inRef && (value[i] === "+" || value[i] === "*" || value[i] === "/")) return true;
    // Minus is tricky — only count as operator if preceded by a number/unit or )
    if (!inRef && value[i] === "-" && i > 0 && (value[i - 1] === " " || value[i - 1] === ")"))
      return true;
  }
  return false;
}

function hasTokenRefs(value: string): boolean {
  return /\{[^}]+\}/.test(value);
}

function extractNumericValue(value: unknown): number | undefined {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const num = parseFloat(value);
    return isNaN(num) ? undefined : num;
  }
  // Handle W3C dimension/duration format {value, unit}
  if (typeof value === "object" && value !== null && "value" in value) {
    const v = (value as { value: unknown }).value;
    return typeof v === "number" ? v : undefined;
  }
  return undefined;
}

/**
 * Schema-phase extension that evaluates math expressions in token values.
 *
 * Runs BEFORE normalization so raw `$value` strings like `"8px + 4px"` are still intact.
 *
 * Two execution paths:
 * - Pure literal math (no `{refs}`): evaluates and mutates `$value` with result
 * - Math with token references: evaluates for static fallback, mutates `$value`,
 *   and stores original expression in `$extensions["design-sync.math"]` for CSS plugin
 *   to generate `calc(var(...))` output
 */
export function mathExpressionsExtension(options?: MathExpressionsOptions): ProcessorExtension {
  const types = new Set(options?.types ?? ["dimension", "number"]);

  return {
    name: "math-expressions",
    phase: "schema",

    onSchemaToken(path: string, token: DesignToken, context: SchemaExtensionContext) {
      if (!types.has(token.$type as string)) return;

      const rawValue = String(token.$value);
      if (!hasMathOperator(rawValue)) return;

      const resolveRef = (ref: string): number | undefined => {
        const refToken = context.getToken(ref);
        if (!refToken) return undefined;
        return extractNumericValue(refToken.$value);
      };

      const result = parseMathExpression(rawValue, resolveRef);
      if (!result) {
        context.logger.warn(`Could not evaluate math expression: ${rawValue}`, path);
        return;
      }

      const newValue = result.unit ? `${result.value}${result.unit}` : result.value;
      token.$value = newValue as any;

      // If expression has token refs, store metadata for CSS calc() output
      if (hasTokenRefs(rawValue)) {
        if (!token.$extensions) {
          token.$extensions = {};
        }
        const metadata: MathExpressionMetadata = {
          expression: rawValue,
          hasRefs: true,
        };

        // Process mode values
        if (token.$extensions.mode && typeof token.$extensions.mode === "object") {
          const modeExt = token.$extensions.mode as Record<string, unknown>;
          const modeExpressions: Record<string, string> = {};
          for (const [mode, modeValue] of Object.entries(modeExt)) {
            const modeStr = String(modeValue);
            if (hasMathOperator(modeStr)) {
              if (hasTokenRefs(modeStr)) {
                modeExpressions[mode] = modeStr;
              }
              const modeResult = parseMathExpression(modeStr, resolveRef);
              if (modeResult) {
                modeExt[mode] = modeResult.unit
                  ? `${modeResult.value}${modeResult.unit}`
                  : modeResult.value;
              }
            }
          }
          if (Object.keys(modeExpressions).length > 0) {
            metadata.modeExpressions = modeExpressions;
          }
        }

        token.$extensions["design-sync.math"] = metadata;
      } else {
        // Pure math — also process mode values
        if (token.$extensions?.mode && typeof token.$extensions.mode === "object") {
          const modeExt = token.$extensions.mode as Record<string, unknown>;
          for (const [mode, modeValue] of Object.entries(modeExt)) {
            const modeStr = String(modeValue);
            if (hasMathOperator(modeStr)) {
              const modeResult = parseMathExpression(modeStr, resolveRef);
              if (modeResult) {
                modeExt[mode] = modeResult.unit
                  ? `${modeResult.value}${modeResult.unit}`
                  : modeResult.value;
              }
            }
          }
        }
      }
    },
  };
}
