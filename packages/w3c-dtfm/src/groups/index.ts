/**
 * Group Features
 *
 * W3C-compliant group handling including $extends and $root.
 */

export * from "./extends";
export * from "./root";

import { resolveAllExtends } from "./extends";
import { extractRootTokens, expandRootTokens, mergeRootWithGroupDefaults } from "./root";
import { isObject } from "@design-sync/utils";
import type { TokenType } from "../types";

export interface ProcessGroupsResult {
  tokens: Record<string, unknown>;
  rootTokens: Map<string, { token: Record<string, unknown>; type?: TokenType }>;
  errors: string[];
}

/**
 * Process all group features ($extends, $root)
 */
export function processGroups(tokens: Record<string, unknown>): ProcessGroupsResult {
  const errors: string[] = [];

  // First, resolve $extends
  const extendsResult = resolveAllExtends(tokens);
  for (const error of extendsResult.errors) {
    errors.push(`${error.path}: ${error.message}`);
  }

  // Then extract and process $root tokens
  const rootTokens = extractRootTokens(extendsResult.resolved);

  // Expand $root tokens
  const expandedTokens = expandRootTokens(extendsResult.resolved);

  return {
    tokens: expandedTokens,
    rootTokens,
    errors,
  };
}

/**
 * Get all tokens including $root tokens as regular tokens
 */
export function flattenTokensWithRoot(
  tokens: Record<string, unknown>,
): Map<string, Record<string, unknown>> {
  const result = new Map<string, Record<string, unknown>>();

  function walk(obj: Record<string, unknown>, path: string = "", groupType?: TokenType): void {
    const currentGroupType = (obj.$type as TokenType) ?? groupType;

    for (const [key, value] of Object.entries(obj)) {
      if (key === "$root") {
        // Add $root token at the current group's path
        const rootToken = value as Record<string, unknown>;
        const fullToken = mergeRootWithGroupDefaults(rootToken, obj);
        if (path) {
          result.set(path, fullToken);
        }
        continue;
      }

      if (key.startsWith("$")) {
        continue;
      }

      const currentPath = path ? `${path}.${key}` : key;

      if (isObject(value)) {
        const valueObj = value as Record<string, unknown>;

        // Check if it's a token (has $value)
        if ("$value" in valueObj) {
          result.set(currentPath, valueObj);
        }

        // Recurse into groups
        walk(valueObj, currentPath, currentGroupType);
      }
    }
  }

  walk(tokens);
  return result;
}

/**
 * Check if tokens use any group features
 */
export function usesGroupFeatures(tokens: Record<string, unknown>): {
  hasExtends: boolean;
  hasRoot: boolean;
} {
  let hasExtends = false;
  let hasRoot = false;

  function check(obj: Record<string, unknown>): void {
    for (const [key, value] of Object.entries(obj)) {
      if (key === "$extends") {
        hasExtends = true;
      }
      if (key === "$root") {
        hasRoot = true;
      }
      if (hasExtends && hasRoot) {
        return; // Both found, no need to continue
      }
      if (isObject(value)) {
        check(value as Record<string, unknown>);
      }
    }
  }

  check(tokens);
  return { hasExtends, hasRoot };
}
