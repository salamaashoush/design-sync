/**
 * Reference Handling
 *
 * Utilities for parsing and resolving token references.
 */

import { isObject, get } from "@design-sync/utils";
import { isW3CTokenRef } from "../types/w3c";
import { isLegacyTokenAlias } from "../types/legacy";
import type { W3CTokenRef, W3CTokenAlias } from "../types/w3c";
import type { LegacyTokenAlias } from "../types/legacy";

export type TokenReference = W3CTokenRef | W3CTokenAlias | LegacyTokenAlias;

/**
 * Check if a value is any kind of token reference
 */
export function isTokenReference(value: unknown): value is TokenReference {
  return isW3CTokenRef(value) || isLegacyTokenAlias(value);
}

/**
 * Parse a reference to get the token path
 */
export function parseReference(ref: TokenReference): string {
  // W3C $ref format: {"$ref": "#/path/to/token"}
  if (isW3CTokenRef(ref)) {
    // Remove #/ prefix and convert slashes to dots
    return ref.$ref.slice(2).replace(/\//g, ".");
  }

  // Legacy alias format: "{path.to.token}"
  if (typeof ref === "string") {
    // Remove curly braces
    return ref.slice(1, -1).replace(".$value", "");
  }

  throw new Error(`Invalid reference format: ${JSON.stringify(ref)}`);
}

/**
 * Convert a path to W3C $ref format
 */
export function pathToW3CRef(path: string): W3CTokenRef {
  return { $ref: `#/${path.replace(/\./g, "/")}` };
}

/**
 * Convert a path to legacy alias format
 */
export function pathToLegacyAlias(path: string): LegacyTokenAlias {
  return `{${path}}` as LegacyTokenAlias;
}

/**
 * Normalize a reference to a path string
 */
export function normalizeReference(ref: unknown): string | null {
  if (isTokenReference(ref)) {
    return parseReference(ref);
  }
  return null;
}

/**
 * Collect all references from a value (recursively)
 */
export function collectReferencesFromValue(value: unknown): string[] {
  const refs: string[] = [];

  if (isTokenReference(value)) {
    refs.push(parseReference(value));
    return refs;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      refs.push(...collectReferencesFromValue(item));
    }
    return refs;
  }

  if (isObject(value)) {
    for (const v of Object.values(value)) {
      refs.push(...collectReferencesFromValue(v));
    }
  }

  return refs;
}

/**
 * Collect all references from a tokens object
 */
export function collectAllReferences(
  tokens: Record<string, unknown>,
): Map<string, { refs: string[]; value: unknown }> {
  const tokenRefs = new Map<string, { refs: string[]; value: unknown }>();

  function walk(obj: Record<string, unknown>, path: string = ""): void {
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith("$")) continue;

      const currentPath = path ? `${path}.${key}` : key;

      if (isObject(value)) {
        if ("$value" in value) {
          // It's a token
          const refs = collectReferencesFromValue(value.$value);
          tokenRefs.set(currentPath, { refs, value: value.$value });
        }
        walk(value as Record<string, unknown>, currentPath);
      }
    }
  }

  walk(tokens);
  return tokenRefs;
}

/**
 * Replace references in a value with resolved values
 */
export function replaceReferences(value: unknown, resolver: (path: string) => unknown): unknown {
  if (isTokenReference(value)) {
    const path = parseReference(value);
    return resolver(path);
  }

  if (Array.isArray(value)) {
    return value.map((item) => replaceReferences(item, resolver));
  }

  if (isObject(value)) {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = replaceReferences(v, resolver);
    }
    return result;
  }

  return value;
}

/**
 * Check if a value contains any references
 */
export function hasReferences(value: unknown): boolean {
  if (isTokenReference(value)) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(hasReferences);
  }

  if (isObject(value)) {
    return Object.values(value).some(hasReferences);
  }

  return false;
}

/**
 * Get token value from tokens object by path
 */
export function getTokenByPath(tokens: Record<string, unknown>, path: string): unknown {
  return get(tokens, path);
}

/**
 * Get token $value from tokens object by path
 */
export function getTokenValueByPath(tokens: Record<string, unknown>, path: string): unknown {
  const token = getTokenByPath(tokens, path);
  if (isObject(token) && "$value" in token) {
    return token.$value;
  }
  return undefined;
}

/**
 * Get token $type from tokens object by path
 */
export function getTokenTypeByPath(
  tokens: Record<string, unknown>,
  path: string,
): string | undefined {
  const token = getTokenByPath(tokens, path);
  if (isObject(token) && "$type" in token && typeof token.$type === "string") {
    return token.$type;
  }
  return undefined;
}

/**
 * Validate a reference path format
 */
export function isValidReferencePath(path: string): boolean {
  // Path should not be empty
  if (!path || path.length === 0) {
    return false;
  }

  // Path should not start with a dot
  if (path.startsWith(".")) {
    return false;
  }

  // Path should not end with a dot
  if (path.endsWith(".")) {
    return false;
  }

  // Path should not contain consecutive dots
  if (path.includes("..")) {
    return false;
  }

  return true;
}
