/**
 * Type Inference System
 *
 * Infer token types following W3C priority rules:
 * 1. Explicit $type on token
 * 2. Resolved type from referenced token (if alias)
 * 3. Inherited $type from closest parent group
 * 4. Invalid (error)
 *
 * @see https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/#type
 */

import { isObject, get } from "@design-sync/utils";
import { isTokenReference, parseReference } from "../resolver/references";
import type { TokenType } from "../types";

export interface TypeInferenceResult {
  type?: TokenType;
  source: "explicit" | "reference" | "inherited" | "none";
  path: string;
  referencedPath?: string;
  inheritedFrom?: string;
}

export interface TypeInferenceError {
  path: string;
  message: string;
}

/**
 * Get the explicit $type from a token
 */
export function getExplicitType(token: Record<string, unknown>): TokenType | undefined {
  if ("$type" in token && typeof token.$type === "string") {
    return token.$type as TokenType;
  }
  return undefined;
}

/**
 * Get inherited $type from parent groups
 * Walks up the path hierarchy looking for the closest parent with $type
 */
export function getInheritedType(
  tokens: Record<string, unknown>,
  path: string,
): { type: TokenType; inheritedFrom: string } | undefined {
  const parts = path.split(".");

  // Walk up from parent to root
  for (let i = parts.length - 1; i >= 0; i--) {
    const parentPath = parts.slice(0, i).join(".");
    const parent = parentPath ? get(tokens, parentPath) : tokens;

    if (isObject(parent) && "$type" in parent && typeof parent.$type === "string") {
      return {
        type: parent.$type as TokenType,
        inheritedFrom: parentPath || "$root",
      };
    }
  }

  return undefined;
}

/**
 * Get type from a referenced token (alias resolution)
 */
export function getReferencedType(
  tokens: Record<string, unknown>,
  value: unknown,
  visited: Set<string> = new Set(),
): { type: TokenType; referencedPath: string } | undefined {
  if (!isTokenReference(value)) {
    return undefined;
  }

  const refPath = parseReference(value);

  // Prevent infinite loops
  if (visited.has(refPath)) {
    return undefined;
  }
  visited.add(refPath);

  // Get the referenced token
  const refToken = get(tokens, refPath);
  if (!isObject(refToken)) {
    return undefined;
  }

  // Check for explicit type on referenced token
  const explicitType = getExplicitType(refToken as Record<string, unknown>);
  if (explicitType) {
    return { type: explicitType, referencedPath: refPath };
  }

  // Check if referenced token is also an alias
  if ("$value" in refToken && isTokenReference(refToken.$value)) {
    const nestedResult = getReferencedType(tokens, refToken.$value, visited);
    if (nestedResult) {
      return nestedResult;
    }
  }

  // Check for inherited type on referenced token
  const inherited = getInheritedType(tokens, refPath);
  if (inherited) {
    return { type: inherited.type, referencedPath: refPath };
  }

  return undefined;
}

/**
 * Infer the type of a token following W3C priority rules
 */
export function inferTokenType(tokens: Record<string, unknown>, path: string): TypeInferenceResult {
  const token = get(tokens, path);

  if (!isObject(token)) {
    return { source: "none", path };
  }

  const tokenObj = token as Record<string, unknown>;

  // 1. Explicit $type on token
  const explicitType = getExplicitType(tokenObj);
  if (explicitType) {
    return {
      type: explicitType,
      source: "explicit",
      path,
    };
  }

  // 2. Type from referenced token (if alias)
  if ("$value" in tokenObj && isTokenReference(tokenObj.$value)) {
    const refResult = getReferencedType(tokens, tokenObj.$value);
    if (refResult) {
      return {
        type: refResult.type,
        source: "reference",
        path,
        referencedPath: refResult.referencedPath,
      };
    }
  }

  // 3. Inherited $type from closest parent group
  const inherited = getInheritedType(tokens, path);
  if (inherited) {
    return {
      type: inherited.type,
      source: "inherited",
      path,
      inheritedFrom: inherited.inheritedFrom,
    };
  }

  // 4. Cannot infer type
  return { source: "none", path };
}

/**
 * Infer types for all tokens in a tokens object
 */
export function inferAllTypes(tokens: Record<string, unknown>): Map<string, TypeInferenceResult> {
  const results = new Map<string, TypeInferenceResult>();

  function walk(obj: Record<string, unknown>, path: string = ""): void {
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith("$")) {
        continue;
      }

      const currentPath = path ? `${path}.${key}` : key;

      if (isObject(value)) {
        const valueObj = value as Record<string, unknown>;

        // Check if it's a token (has $value)
        if ("$value" in valueObj) {
          results.set(currentPath, inferTokenType(tokens, currentPath));
        }

        // Recurse into groups
        walk(valueObj, currentPath);
      }
    }
  }

  walk(tokens);
  return results;
}

/**
 * Find tokens that cannot have their type inferred
 */
export function findUntyped(tokens: Record<string, unknown>): TypeInferenceError[] {
  const errors: TypeInferenceError[] = [];
  const allTypes = inferAllTypes(tokens);

  for (const [path, result] of allTypes) {
    if (result.source === "none") {
      errors.push({
        path,
        message: `Cannot infer type for token at "${path}". Add explicit $type or ensure parent group or referenced token has $type.`,
      });
    }
  }

  return errors;
}

/**
 * Apply inferred types to tokens (modifies in place)
 */
export function applyInferredTypes(tokens: Record<string, unknown>): void {
  const allTypes = inferAllTypes(tokens);

  for (const [path, result] of allTypes) {
    if (result.type && result.source !== "explicit") {
      const token = get(tokens, path) as Record<string, unknown>;
      if (token) {
        token.$type = result.type;
      }
    }
  }
}

/**
 * Create a copy of tokens with all types made explicit
 */
export function resolveAllTypes(tokens: Record<string, unknown>): Record<string, unknown> {
  const result = JSON.parse(JSON.stringify(tokens)) as Record<string, unknown>;
  applyInferredTypes(result);
  return result;
}

/**
 * Check if all tokens have resolvable types
 */
export function allTypesResolvable(tokens: Record<string, unknown>): boolean {
  const errors = findUntyped(tokens);
  return errors.length === 0;
}

/**
 * Get type inheritance chain for debugging
 */
export function getTypeInheritanceChain(tokens: Record<string, unknown>, path: string): string[] {
  const chain: string[] = [];
  const parts = path.split(".");

  for (let i = parts.length; i >= 0; i--) {
    const currentPath = parts.slice(0, i).join(".");
    const current = currentPath ? get(tokens, currentPath) : tokens;

    if (isObject(current) && "$type" in current) {
      chain.push(`${currentPath || "$root"}: ${current.$type}`);
    }
  }

  return chain.reverse();
}

/**
 * Validate type consistency for referenced tokens
 * Ensures that when a token references another, the types are compatible
 */
export function validateTypeConsistency(tokens: Record<string, unknown>): TypeInferenceError[] {
  const errors: TypeInferenceError[] = [];
  const allTypes = inferAllTypes(tokens);

  for (const [path, result] of allTypes) {
    if (!result.type) continue;

    const token = get(tokens, path) as Record<string, unknown>;
    if (!token || !("$value" in token)) continue;

    // If it's a reference, check type consistency
    if (isTokenReference(token.$value)) {
      const refPath = parseReference(token.$value);
      const refResult = allTypes.get(refPath);

      if (refResult?.type && result.type !== refResult.type) {
        // Allow if this token doesn't have explicit type (it will take ref's type)
        if (result.source === "explicit") {
          errors.push({
            path,
            message: `Type mismatch: "${path}" has type "${result.type}" but references "${refPath}" which has type "${refResult.type}"`,
          });
        }
      }
    }
  }

  return errors;
}
