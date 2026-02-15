import { isObject } from "@design-sync/utils";
import type { TokenAlias, W3CTokenRef } from "./types";

/**
 * Normalize a token alias (curly brace format) to a path string
 */
export function normalizeTokenAlias(tokenAlias: TokenAlias | string): string {
  return (
    tokenAlias
      // TODO: this is a hack to remove the $value from the token path, until we migrate isa's figma plugin
      .replace(".$value", "")
      .replace(/[{}]/g, "")
  );
}

/**
 * Normalize a $ref (JSON Pointer format) to a path string
 */
export function normalizeTokenRef(tokenRef: W3CTokenRef): string {
  // Remove #/ prefix and convert slashes to dots
  return tokenRef.$ref.slice(2).replace(/\//g, ".");
}

/**
 * Normalize any reference format (alias or $ref) to a path string
 */
export function normalizeReference(ref: TokenAlias | W3CTokenRef | string): string {
  if (isObject(ref) && "$ref" in ref) {
    return normalizeTokenRef(ref as W3CTokenRef);
  }
  return normalizeTokenAlias(ref as TokenAlias | string);
}

/**
 * Convert a path to curly brace alias format
 */
export function pathToAlias(path: string): TokenAlias {
  return `{${path}}` as TokenAlias;
}

/**
 * Convert a path to $ref format
 */
export function pathToRef(path: string): W3CTokenRef {
  return { $ref: `#/${path.replace(/\./g, "/")}` };
}

/**
 * Check if a string is a valid curly brace alias
 */
export function isValidAlias(value: string): boolean {
  return /^\{[^{}]+(\.[^{}]+)*\}$/.test(value);
}

/**
 * Check if an object is a valid $ref
 */
export function isValidRef(value: unknown): value is W3CTokenRef {
  if (!isObject(value)) return false;
  const ref = value as W3CTokenRef;
  return typeof ref.$ref === "string" && ref.$ref.startsWith("#/");
}
