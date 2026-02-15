/**
 * 4-Stage Resolver Algorithm
 *
 * Per W3C spec:
 * 1. Input Validation
 * 2. Ordering (dependency graph, topological sort)
 * 3. Alias Resolution (with circular detection)
 * 4. Output
 *
 * @see https://www.w3.org/community/reports/design-tokens/CG-FINAL-resolver-20251028/
 */

import { isObject, get } from "@design-sync/utils";
import { validateTokensSchema, type SchemaValidationOptions } from "../validation/schema";
import { TokenValidationError, type ValidationError } from "../validation/errors";
import {
  collectAllReferences,
  getTokenTypeByPath,
  isTokenReference,
  parseReference,
  replaceReferences,
} from "./references";
import {
  ResolverError,
  ResolverErrorCode,
  CircularReferenceError,
  MissingReferenceError,
  type ResolverResult,
  type ResolverWarning,
} from "./errors";
import type { TokenType } from "../types";

export interface ResolverOptions {
  /**
   * Validate input before resolving
   * @default true
   */
  validateInput?: boolean;
  /**
   * Validation options
   */
  validationOptions?: SchemaValidationOptions;
  /**
   * Throw on errors instead of returning them
   * @default false
   */
  throwOnError?: boolean;
  /**
   * Resolve all references (deep resolve)
   * @default true
   */
  deepResolve?: boolean;
  /**
   * Infer types from resolved references
   * @default true
   */
  inferTypes?: boolean;
}

export interface DependencyNode {
  path: string;
  dependencies: string[];
  dependents: string[];
  value: unknown;
  type?: TokenType;
  resolved?: boolean;
  resolvedValue?: unknown;
}

export type DependencyGraph = Map<string, DependencyNode>;

/**
 * Stage 1: Input Validation
 *
 * Validate the input token file structure.
 */
export function stage1Validate(
  tokens: Record<string, unknown>,
  options: SchemaValidationOptions = {},
): { valid: boolean; errors: ValidationError[] } {
  const result = validateTokensSchema(tokens, options);
  return {
    valid: result.valid,
    errors: result.errors,
  };
}

/**
 * Stage 2: Ordering
 *
 * Build dependency graph and perform topological sort.
 */
export function stage2BuildDependencyGraph(tokens: Record<string, unknown>): DependencyGraph {
  const graph: DependencyGraph = new Map();

  // Collect all tokens and their references
  const tokenRefs = collectAllReferences(tokens);

  // Create nodes for all tokens
  for (const [path, { refs, value }] of tokenRefs) {
    const type = getTokenTypeByPath(tokens, path);
    graph.set(path, {
      path,
      dependencies: refs,
      dependents: [],
      value,
      type: type as TokenType | undefined,
      resolved: false,
    });
  }

  // Build reverse dependencies (dependents)
  for (const [path, node] of graph) {
    for (const dep of node.dependencies) {
      const depNode = graph.get(dep);
      if (depNode) {
        depNode.dependents.push(path);
      }
    }
  }

  return graph;
}

/**
 * Perform topological sort on the dependency graph
 */
export function topologicalSort(graph: DependencyGraph): {
  order: string[];
  cycles: string[][];
} {
  const order: string[] = [];
  const cycles: string[][] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  function visit(path: string, stack: string[] = []): void {
    if (visited.has(path)) {
      return;
    }

    if (visiting.has(path)) {
      // Found a cycle
      const cycleStart = stack.indexOf(path);
      const cycle = [...stack.slice(cycleStart), path];
      cycles.push(cycle);
      return;
    }

    visiting.add(path);
    stack.push(path);

    const node = graph.get(path);
    if (node) {
      for (const dep of node.dependencies) {
        visit(dep, [...stack]);
      }
    }

    visiting.delete(path);
    visited.add(path);
    order.push(path);
  }

  // Visit all nodes
  for (const path of graph.keys()) {
    visit(path);
  }

  return { order, cycles };
}

/**
 * Stage 3: Alias Resolution
 *
 * Resolve all references in the correct order.
 */
export function stage3ResolveAliases(
  tokens: Record<string, unknown>,
  graph: DependencyGraph,
  order: string[],
  options: ResolverOptions = {},
): { errors: ResolverError[]; warnings: ResolverWarning[] } {
  const errors: ResolverError[] = [];
  const warnings: ResolverWarning[] = [];
  const resolvedValues = new Map<string, unknown>();

  // Process tokens in topological order
  for (const path of order) {
    const node = graph.get(path);
    if (!node) continue;

    try {
      // If no dependencies, the value is already resolved
      if (node.dependencies.length === 0) {
        node.resolved = true;
        node.resolvedValue = node.value;
        resolvedValues.set(path, node.value);
        continue;
      }

      // Check all dependencies are resolved
      const missingDeps: string[] = [];
      for (const dep of node.dependencies) {
        if (!resolvedValues.has(dep) && !graph.has(dep)) {
          missingDeps.push(dep);
        }
      }

      if (missingDeps.length > 0) {
        for (const dep of missingDeps) {
          errors.push(new MissingReferenceError(path, dep));
        }
        continue;
      }

      // Resolve the value
      const resolved = replaceReferences(node.value, (refPath) => {
        return resolvedValues.get(refPath);
      });

      node.resolved = true;
      node.resolvedValue = resolved;
      resolvedValues.set(path, resolved);

      // Infer type from resolved reference if needed
      if (options.inferTypes && !node.type && isTokenReference(node.value)) {
        const refPath = parseReference(node.value);
        const refNode = graph.get(refPath);
        if (refNode?.type) {
          node.type = refNode.type;
        }
      }
    } catch (error) {
      errors.push(
        new ResolverError(
          error instanceof Error ? error.message : "Unknown error during resolution",
          path,
          ResolverErrorCode.INVALID_VALUE,
          error,
        ),
      );
    }
  }

  return { errors, warnings };
}

/**
 * Stage 4: Output
 *
 * Build the resolved tokens object.
 */
export function stage4BuildOutput(
  tokens: Record<string, unknown>,
  graph: DependencyGraph,
): Record<string, unknown> {
  // Deep clone the tokens
  const result = JSON.parse(JSON.stringify(tokens)) as Record<string, unknown>;

  // Apply resolved values
  for (const [path, node] of graph) {
    if (node.resolved && node.resolvedValue !== undefined) {
      // Navigate to the token and update its $value
      const parts = path.split(".");
      let current: Record<string, unknown> = result;

      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]] as Record<string, unknown>;
      }

      const lastPart = parts[parts.length - 1];
      if (current && isObject(current[lastPart])) {
        (current[lastPart] as Record<string, unknown>).$value = node.resolvedValue;
      }
    }
  }

  return result;
}

/**
 * Detect circular references in the graph
 */
export function detectCircularReferences(graph: DependencyGraph): CircularReferenceError[] {
  const { cycles } = topologicalSort(graph);
  return cycles.map((cycle) => new CircularReferenceError(cycle[0], cycle));
}

/**
 * Get inherited type from parent groups
 */
export function getInheritedType(
  tokens: Record<string, unknown>,
  path: string,
): TokenType | undefined {
  const parts = path.split(".");

  // Walk up the path looking for $type
  for (let i = parts.length - 1; i >= 0; i--) {
    const parentPath = parts.slice(0, i).join(".");
    const parent = parentPath ? get(tokens, parentPath) : tokens;

    if (isObject(parent) && "$type" in parent && typeof parent.$type === "string") {
      return parent.$type as TokenType;
    }
  }

  return undefined;
}

/**
 * Infer type for a token
 *
 * Priority:
 * 1. Explicit $type on token
 * 2. Resolved type from referenced token (if alias)
 * 3. Inherited $type from closest parent group
 * 4. Invalid (error)
 */
export function inferTokenType(
  tokens: Record<string, unknown>,
  path: string,
  graph: DependencyGraph,
): TokenType | undefined {
  const node = graph.get(path);
  if (!node) return undefined;

  // 1. Explicit type
  if (node.type) {
    return node.type;
  }

  // 2. Type from resolved reference
  if (isTokenReference(node.value)) {
    const refPath = parseReference(node.value);
    const refNode = graph.get(refPath);
    if (refNode?.type) {
      return refNode.type;
    }
    // Recursively infer from reference
    return inferTokenType(tokens, refPath, graph);
  }

  // 3. Inherited type from parent
  const inheritedType = getInheritedType(tokens, path);
  if (inheritedType) {
    return inheritedType;
  }

  // 4. Cannot infer
  return undefined;
}

/**
 * Full resolution pipeline
 */
export function runResolver(
  tokens: Record<string, unknown>,
  options: ResolverOptions = {},
): ResolverResult<Record<string, unknown>> {
  const {
    validateInput = true,
    validationOptions = {},
    throwOnError = false,
    deepResolve: _deepResolve = true,
    inferTypes = true,
  } = options;

  const errors: ResolverError[] = [];
  const warnings: ResolverWarning[] = [];

  // Stage 1: Validation
  if (validateInput) {
    const validation = stage1Validate(tokens, validationOptions);
    if (!validation.valid && throwOnError) {
      throw new TokenValidationError(validation.errors);
    }
    // Convert validation errors to resolver warnings (we continue anyway)
    for (const error of validation.errors) {
      if (error.severity === "error") {
        warnings.push({
          path: error.path,
          message: error.message,
          code: error.code,
        });
      }
    }
  }

  // Stage 2: Build dependency graph
  const graph = stage2BuildDependencyGraph(tokens);

  // Detect cycles
  const circularErrors = detectCircularReferences(graph);
  if (circularErrors.length > 0) {
    errors.push(...circularErrors);
    if (throwOnError) {
      throw circularErrors[0];
    }
    return { success: false, errors, warnings };
  }

  // Get processing order
  const { order, cycles } = topologicalSort(graph);
  if (cycles.length > 0) {
    for (const cycle of cycles) {
      errors.push(new CircularReferenceError(cycle[0], cycle));
    }
    if (throwOnError && errors.length > 0) {
      throw errors[0];
    }
    return { success: false, errors, warnings };
  }

  // Stage 3: Resolve aliases
  const resolution = stage3ResolveAliases(tokens, graph, order, { ...options, inferTypes });
  errors.push(...resolution.errors);
  warnings.push(...resolution.warnings);

  if (errors.length > 0 && throwOnError) {
    throw errors[0];
  }

  // Infer types for tokens that need it
  if (inferTypes) {
    for (const [path, node] of graph) {
      if (!node.type) {
        const inferredType = inferTokenType(tokens, path, graph);
        if (inferredType) {
          node.type = inferredType;
        } else if (!isTokenReference(node.value)) {
          // Only error if it's not a pure alias
          warnings.push({
            path,
            message: "Cannot infer type for token",
            code: ResolverErrorCode.CANNOT_INFER_TYPE,
          });
        }
      }
    }
  }

  // Stage 4: Build output
  const resolvedTokens = stage4BuildOutput(tokens, graph);

  return {
    success: errors.length === 0,
    value: resolvedTokens,
    errors,
    warnings,
  };
}
