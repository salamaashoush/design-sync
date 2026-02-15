import { isRegExp, toArray } from "@design-sync/utils";
import { SUPPORTED_TYPES } from "../constants";
import type { TokenType } from "../types";
import type { ProcessedToken, TokenFilter, TokenFilterObject, TokenFilterPredicate } from "./types";

/**
 * Compiled filter function type
 */
export type CompiledFilter = (token: ProcessedToken) => boolean;

/**
 * Check if a value is a valid TokenType
 */
function isTokenType(value: unknown): value is TokenType {
  return typeof value === "string" && SUPPORTED_TYPES.includes(value as TokenType);
}

/**
 * Check if value matches a string or RegExp pattern
 */
function matchesPattern(value: string, pattern: string | RegExp): boolean {
  if (typeof pattern === "string") {
    // Support glob-like patterns with * as wildcard
    if (pattern.includes("*")) {
      const regexPattern = pattern
        .replace(/[.+?^${}()|[\]\\]/g, "\\$&") // Escape special chars except *
        .replace(/\*/g, ".*"); // Convert * to .*
      return new RegExp(`^${regexPattern}$`).test(value);
    }
    return value === pattern || value.includes(pattern);
  }
  if (isRegExp(pattern)) {
    return pattern.test(value);
  }
  return false;
}

/**
 * Compile a TokenFilterObject into a predicate function
 */
function compileFilterObject(filter: TokenFilterObject): CompiledFilter {
  const predicates: CompiledFilter[] = [];

  // Type filter
  if (filter.type !== undefined) {
    const types = toArray(filter.type);
    predicates.push((token) => types.includes(token.type));
  }

  // Path filter
  if (filter.path !== undefined) {
    const patterns = toArray(filter.path);
    predicates.push((token) => patterns.some((p) => matchesPattern(token.path, p)));
  }

  // Group filter
  if (filter.group !== undefined) {
    const groupPattern = filter.group;
    predicates.push((token) => matchesPattern(token.group, groupPattern));
  }

  // Deprecated filter
  if (filter.deprecated !== undefined) {
    predicates.push((token) => token.isDeprecated === filter.deprecated);
  }

  // Extension filter
  if (filter.hasExtension !== undefined) {
    const extName = filter.hasExtension;
    predicates.push((token) => token.hasExtension(extName));
  }

  // Generated filter
  if (filter.generated !== undefined) {
    predicates.push((token) => token.isGenerated === filter.generated);
  }

  // Mode filter
  if (filter.hasMode !== undefined) {
    const mode = filter.hasMode;
    predicates.push((token) => mode in token.modeValues);
  }

  // Combine all predicates with AND logic
  if (predicates.length === 0) {
    return () => true;
  }
  if (predicates.length === 1) {
    return predicates[0];
  }
  return (token) => predicates.every((p) => p(token));
}

/**
 * Compile any TokenFilter into a predicate function
 */
export function compileFilter(filter: TokenFilter | undefined): CompiledFilter {
  // No filter means match all
  if (filter === undefined || filter === "*") {
    return () => true;
  }

  // Type filter (single type name)
  if (isTokenType(filter)) {
    return (token) => token.type === filter;
  }

  // Type array filter
  if (Array.isArray(filter)) {
    const typedFilter = filter as TokenType[] | TokenFilter[];
    if (typedFilter.every(isTokenType)) {
      const types = typedFilter as TokenType[];
      return (token) => types.includes(token.type);
    }
    // Array of mixed filters - OR logic
    const compiledFilters = (typedFilter as TokenFilter[]).map((f) => compileFilter(f));
    return (token) => compiledFilters.some((cf) => cf(token));
  }

  // String pattern filter (matches path)
  if (typeof filter === "string") {
    return (token) => matchesPattern(token.path, filter);
  }

  // RegExp filter (matches path)
  if (isRegExp(filter)) {
    return (token) => filter.test(token.path);
  }

  // Function filter (predicate)
  if (typeof filter === "function") {
    return filter as TokenFilterPredicate;
  }

  // Object filter
  if (typeof filter === "object" && filter !== null) {
    return compileFilterObject(filter);
  }

  // Unknown filter type, match nothing
  return () => false;
}

/**
 * Combine multiple filters with AND logic
 */
export function combineFiltersAnd(...filters: (TokenFilter | undefined)[]): CompiledFilter {
  const compiledFilters = filters.filter((f) => f !== undefined).map((f) => compileFilter(f));

  if (compiledFilters.length === 0) {
    return () => true;
  }
  if (compiledFilters.length === 1) {
    return compiledFilters[0];
  }
  return (token) => compiledFilters.every((cf) => cf(token));
}

/**
 * Combine multiple filters with OR logic
 */
export function combineFiltersOr(...filters: (TokenFilter | undefined)[]): CompiledFilter {
  const compiledFilters = filters.filter((f) => f !== undefined).map((f) => compileFilter(f));

  if (compiledFilters.length === 0) {
    return () => true;
  }
  if (compiledFilters.length === 1) {
    return compiledFilters[0];
  }
  return (token) => compiledFilters.some((cf) => cf(token));
}

/**
 * Negate a filter
 */
export function negateFilter(filter: TokenFilter | CompiledFilter): CompiledFilter {
  const compiled =
    typeof filter === "function" && !("name" in filter)
      ? (filter as CompiledFilter)
      : compileFilter(filter as TokenFilter);
  return (token) => !compiled(token);
}
