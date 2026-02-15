/**
 * $extends Handling
 *
 * Group inheritance with deep merge following W3C spec.
 * @see https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/#extends
 */

import { isObject, get, deepMerge } from "@design-sync/utils";
import { isTokenReference, parseReference } from "../resolver/references";
import type { W3CReference } from "../types/w3c";

export interface ExtendsError {
  path: string;
  message: string;
  code: "MISSING_EXTENDS_TARGET" | "CIRCULAR_EXTENDS" | "INVALID_EXTENDS_FORMAT";
}

export interface ExtendsResult {
  resolved: Record<string, unknown>;
  errors: ExtendsError[];
}

/**
 * Check if a group has $extends
 */
export function hasExtends(
  group: Record<string, unknown>,
): group is Record<string, unknown> & { $extends: W3CReference } {
  return "$extends" in group && isTokenReference(group.$extends);
}

/**
 * Get the target path from $extends
 */
export function getExtendsTarget(group: Record<string, unknown>): string | null {
  if (!hasExtends(group)) {
    return null;
  }
  return parseReference(group.$extends);
}

/**
 * Resolve a single $extends reference
 */
export function resolveExtends(
  group: Record<string, unknown>,
  tokens: Record<string, unknown>,
  groupPath: string,
  visited: Set<string> = new Set(),
): ExtendsResult {
  const errors: ExtendsError[] = [];

  if (!hasExtends(group)) {
    return { resolved: group, errors };
  }

  const targetPath = getExtendsTarget(group);
  if (!targetPath) {
    errors.push({
      path: groupPath,
      message: "Invalid $extends format",
      code: "INVALID_EXTENDS_FORMAT",
    });
    return { resolved: group, errors };
  }

  // Check for circular extends
  if (visited.has(targetPath)) {
    errors.push({
      path: groupPath,
      message: `Circular $extends detected: ${[...visited, targetPath].join(" -> ")}`,
      code: "CIRCULAR_EXTENDS",
    });
    return { resolved: group, errors };
  }

  // Get the target group
  const target = get(tokens, targetPath);
  if (!target || !isObject(target)) {
    errors.push({
      path: groupPath,
      message: `$extends target "${targetPath}" not found`,
      code: "MISSING_EXTENDS_TARGET",
    });
    return { resolved: group, errors };
  }

  // If target also has $extends, resolve it first
  visited.add(groupPath);
  let resolvedTarget = target as Record<string, unknown>;
  if (hasExtends(resolvedTarget)) {
    const targetResult = resolveExtends(resolvedTarget, tokens, targetPath, visited);
    resolvedTarget = targetResult.resolved;
    errors.push(...targetResult.errors);
  }

  // Deep merge target into group (group properties take precedence)
  const { $extends: _, ...groupWithoutExtends } = group;
  const merged = deepMerge(resolvedTarget, groupWithoutExtends);

  return { resolved: merged, errors };
}

/**
 * Resolve all $extends in a tokens object
 */
export function resolveAllExtends(tokens: Record<string, unknown>): ExtendsResult {
  const errors: ExtendsError[] = [];

  function processObject(obj: Record<string, unknown>, path: string): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;

      if (key.startsWith("$")) {
        // Skip $extends as it will be handled by resolveExtends
        if (key !== "$extends") {
          result[key] = value;
        }
        continue;
      }

      if (isObject(value)) {
        // Check if it's a group with $extends
        if (hasExtends(value as Record<string, unknown>)) {
          const extendResult = resolveExtends(
            value as Record<string, unknown>,
            tokens,
            currentPath,
          );
          errors.push(...extendResult.errors);
          result[key] = processObject(extendResult.resolved, currentPath);
        } else {
          result[key] = processObject(value as Record<string, unknown>, currentPath);
        }
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  const resolved = processObject(tokens, "");
  return { resolved, errors };
}

/**
 * Check if any groups have $extends
 */
export function hasAnyExtends(tokens: Record<string, unknown>): boolean {
  function check(obj: Record<string, unknown>): boolean {
    for (const [key, value] of Object.entries(obj)) {
      if (key === "$extends") {
        return true;
      }
      if (isObject(value) && check(value as Record<string, unknown>)) {
        return true;
      }
    }
    return false;
  }

  return check(tokens);
}

/**
 * Get all $extends references in a tokens object
 */
export function collectAllExtends(tokens: Record<string, unknown>): Map<string, string> {
  const extends_ = new Map<string, string>();

  function collect(obj: Record<string, unknown>, path: string): void {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;

      if (key === "$extends" && isTokenReference(value)) {
        extends_.set(path, parseReference(value));
      } else if (isObject(value)) {
        collect(value as Record<string, unknown>, currentPath);
      }
    }
  }

  collect(tokens, "");
  return extends_;
}

/**
 * Detect circular $extends chains
 */
export function detectCircularExtends(tokens: Record<string, unknown>): string[][] {
  const extends_ = collectAllExtends(tokens);
  const cycles: string[][] = [];
  const visited = new Set<string>();

  function findCycle(path: string, chain: string[] = []): void {
    if (chain.includes(path)) {
      const cycleStart = chain.indexOf(path);
      cycles.push([...chain.slice(cycleStart), path]);
      return;
    }

    if (visited.has(path)) {
      return;
    }

    const target = extends_.get(path);
    if (target) {
      findCycle(target, [...chain, path]);
    }

    visited.add(path);
  }

  for (const path of extends_.keys()) {
    findCycle(path);
  }

  return cycles;
}
