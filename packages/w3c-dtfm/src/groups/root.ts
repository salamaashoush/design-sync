/**
 * $root Token Handling
 *
 * Reserved base token name in groups following W3C spec.
 * @see https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/#root-token
 */

import { isObject } from "@design-sync/utils";
import type { TokenType } from "../types";

/**
 * Check if a group has a $root token
 */
export function hasRootToken(group: Record<string, unknown>): boolean {
  return (
    "$root" in group &&
    isObject(group.$root) &&
    "$value" in (group.$root as Record<string, unknown>)
  );
}

/**
 * Get the $root token from a group
 */
export function getRootToken(group: Record<string, unknown>): Record<string, unknown> | null {
  if (!hasRootToken(group)) {
    return null;
  }
  return group.$root as Record<string, unknown>;
}

/**
 * Get the type of a $root token (inherits from group $type)
 */
export function getRootTokenType(group: Record<string, unknown>): TokenType | undefined {
  const root = getRootToken(group);
  if (!root) {
    return undefined;
  }

  // $root can have its own $type or inherit from group
  if ("$type" in root && typeof root.$type === "string") {
    return root.$type as TokenType;
  }

  if ("$type" in group && typeof group.$type === "string") {
    return group.$type as TokenType;
  }

  return undefined;
}

/**
 * Extract $root tokens from a tokens object
 * Returns a map of group path to root token
 */
export function extractRootTokens(
  tokens: Record<string, unknown>,
): Map<string, { token: Record<string, unknown>; type?: TokenType }> {
  const rootTokens = new Map<string, { token: Record<string, unknown>; type?: TokenType }>();

  function walk(obj: Record<string, unknown>, path: string = ""): void {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;

      if (key.startsWith("$")) {
        continue;
      }

      if (isObject(value)) {
        const group = value as Record<string, unknown>;

        if (hasRootToken(group)) {
          const token = getRootToken(group)!;
          const type = getRootTokenType(group);
          rootTokens.set(currentPath, { token, type });
        }

        walk(group, currentPath);
      }
    }
  }

  walk(tokens);
  return rootTokens;
}

/**
 * Expand $root tokens into regular tokens
 * The $root token becomes a token at the group's path
 */
export function expandRootTokens(tokens: Record<string, unknown>): Record<string, unknown> {
  function processGroup(
    group: Record<string, unknown>,
    path: string,
    parentType?: TokenType,
  ): Record<string, unknown> {
    const processed: Record<string, unknown> = {};
    const groupType = (group.$type as TokenType) ?? parentType;

    for (const [key, value] of Object.entries(group)) {
      if (key === "$root") {
        // $root is handled separately
        continue;
      }

      if (key.startsWith("$")) {
        processed[key] = value;
        continue;
      }

      if (isObject(value)) {
        const childPath = path ? `${path}.${key}` : key;
        processed[key] = processGroup(value as Record<string, unknown>, childPath, groupType);
      } else {
        processed[key] = value;
      }
    }

    return processed;
  }

  return processGroup(tokens, "", undefined);
}

/**
 * Get token path for a $root token
 * The $root token's effective path is the group's path itself
 */
export function getRootTokenPath(groupPath: string): string {
  return groupPath;
}

/**
 * Create a full token definition from a $root token
 */
export function createFullRootToken(
  root: Record<string, unknown>,
  groupType?: TokenType,
): Record<string, unknown> {
  const token: Record<string, unknown> = {
    ...root,
  };

  // If root doesn't have $type, use group's type
  if (!("$type" in token) && groupType) {
    token.$type = groupType;
  }

  return token;
}

/**
 * Check if a path represents a $root token
 */
export function isRootTokenPath(path: string, tokens: Record<string, unknown>): boolean {
  // A path is a $root token if there's a group at that path with a $root property
  const parts = path.split(".");
  let current: unknown = tokens;

  for (const part of parts) {
    if (!isObject(current)) {
      return false;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return isObject(current) && hasRootToken(current as Record<string, unknown>);
}

/**
 * Validate $root token structure
 */
export function validateRootToken(
  root: unknown,
  groupPath: string,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!isObject(root)) {
    errors.push(`$root at "${groupPath}" must be an object`);
    return { valid: false, errors };
  }

  const rootObj = root as Record<string, unknown>;

  if (!("$value" in rootObj)) {
    errors.push(`$root at "${groupPath}" must have a $value`);
  }

  // $root should not have $type if the group already has one
  // (though it can override the group's type)

  return { valid: errors.length === 0, errors };
}

/**
 * Merge $root token properties with defaults from group
 */
export function mergeRootWithGroupDefaults(
  root: Record<string, unknown>,
  group: Record<string, unknown>,
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...root };

  // Inherit $type from group if not specified
  if (!("$type" in merged) && "$type" in group) {
    merged.$type = group.$type;
  }

  // Inherit $description if not specified
  if (!("$description" in merged) && "$description" in group) {
    merged.$description = group.$description;
  }

  // Inherit $deprecated if not specified
  if (!("$deprecated" in merged) && "$deprecated" in group) {
    merged.$deprecated = group.$deprecated;
  }

  // Inherit $extensions if not specified (but don't deep merge)
  if (!("$extensions" in merged) && "$extensions" in group) {
    merged.$extensions = group.$extensions;
  }

  return merged;
}
