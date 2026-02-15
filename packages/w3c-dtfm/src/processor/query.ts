import type { TokenType } from "../types";
import {
  compileFilter,
  combineFiltersAnd,
  combineFiltersOr,
  negateFilter,
  type CompiledFilter,
} from "./filter";
import type { ProcessedToken, TokenFilter, TokenQueryBuilder } from "./types";

/**
 * Internal filter chain node
 */
interface FilterNode {
  filter: CompiledFilter;
  combinator: "and" | "or";
}

/**
 * Implementation of the fluent TokenQueryBuilder
 */
export class TokenQueryBuilderImpl<
  T extends ProcessedToken = ProcessedToken,
> implements TokenQueryBuilder<T> {
  private source: () => IterableIterator<ProcessedToken>;
  private filters: FilterNode[] = [];
  private sortFn?: (a: T, b: T) => number;
  private skipCount = 0;
  private takeCount?: number;
  private negated = false;

  constructor(source: () => IterableIterator<ProcessedToken>) {
    this.source = source;
  }

  private clone(): TokenQueryBuilderImpl<T> {
    const cloned = new TokenQueryBuilderImpl<T>(this.source);
    cloned.filters = [...this.filters];
    cloned.sortFn = this.sortFn;
    cloned.skipCount = this.skipCount;
    cloned.takeCount = this.takeCount;
    cloned.negated = this.negated;
    return cloned;
  }

  private addFilter(filter: CompiledFilter, combinator: "and" | "or" = "and"): this {
    const cloned = this.clone();
    cloned.filters.push({ filter, combinator });
    return cloned as unknown as this;
  }

  // Type narrowing methods
  ofType<K extends TokenType>(type: K): TokenQueryBuilder<ProcessedToken<K>> {
    return this.addFilter((token) => token.type === type) as unknown as TokenQueryBuilder<
      ProcessedToken<K>
    >;
  }

  ofTypes<K extends TokenType[]>(...types: K): TokenQueryBuilder<ProcessedToken<K[number]>> {
    return this.addFilter((token) =>
      types.includes(token.type as K[number]),
    ) as unknown as TokenQueryBuilder<ProcessedToken<K[number]>>;
  }

  // Path filters
  matching(pattern: string | RegExp): TokenQueryBuilder<T> {
    if (typeof pattern === "string") {
      // Support glob-like patterns with * as wildcard
      if (pattern.includes("*")) {
        const regexPattern = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
        const regex = new RegExp(`^${regexPattern}$`);
        return this.addFilter((token) => regex.test(token.path));
      }
      return this.addFilter((token) => token.path.includes(pattern));
    }
    return this.addFilter((token) => pattern.test(token.path));
  }

  inGroup(groupPath: string): TokenQueryBuilder<T> {
    return this.addFilter(
      (token) => token.group === groupPath || token.group.startsWith(`${groupPath}.`),
    );
  }

  startsWith(prefix: string): TokenQueryBuilder<T> {
    return this.addFilter((token) => token.path.startsWith(prefix));
  }

  // Value/metadata filters
  where(predicate: (token: T) => boolean): TokenQueryBuilder<T> {
    return this.addFilter(predicate as CompiledFilter);
  }

  deprecated(): TokenQueryBuilder<T> {
    return this.addFilter((token) => token.isDeprecated);
  }

  notDeprecated(): TokenQueryBuilder<T> {
    return this.addFilter((token) => !token.isDeprecated);
  }

  withExtension(name: string): TokenQueryBuilder<T> {
    return this.addFilter((token) => token.hasExtension(name));
  }

  generated(): TokenQueryBuilder<T> {
    return this.addFilter((token) => token.isGenerated);
  }

  hasMode(mode: string): TokenQueryBuilder<T> {
    return this.addFilter((token) => mode in token.modeValues);
  }

  // Combinators
  or(other: TokenQueryBuilder<ProcessedToken>): TokenQueryBuilder<T> {
    const otherImpl = other as TokenQueryBuilderImpl<ProcessedToken>;
    const otherFilter = otherImpl.buildCompiledFilter();
    const cloned = this.clone();
    cloned.filters.push({ filter: otherFilter, combinator: "or" });
    return cloned as unknown as TokenQueryBuilder<T>;
  }

  and(other: TokenQueryBuilder<ProcessedToken>): TokenQueryBuilder<T> {
    const otherImpl = other as TokenQueryBuilderImpl<ProcessedToken>;
    const otherFilter = otherImpl.buildCompiledFilter();
    return this.addFilter(otherFilter, "and");
  }

  not(): TokenQueryBuilder<T> {
    const cloned = this.clone();
    cloned.negated = !cloned.negated;
    return cloned as unknown as TokenQueryBuilder<T>;
  }

  // Ordering & pagination
  sortByPath(order: "asc" | "desc" = "asc"): TokenQueryBuilder<T> {
    const cloned = this.clone();
    cloned.sortFn =
      order === "asc"
        ? (a, b) => a.path.localeCompare(b.path)
        : (a, b) => b.path.localeCompare(a.path);
    return cloned as unknown as TokenQueryBuilder<T>;
  }

  sortBy(compareFn: (a: T, b: T) => number): TokenQueryBuilder<T> {
    const cloned = this.clone();
    cloned.sortFn = compareFn;
    return cloned as unknown as TokenQueryBuilder<T>;
  }

  take(count: number): TokenQueryBuilder<T> {
    const cloned = this.clone();
    cloned.takeCount = count;
    return cloned as unknown as TokenQueryBuilder<T>;
  }

  skip(count: number): TokenQueryBuilder<T> {
    const cloned = this.clone();
    cloned.skipCount = count;
    return cloned as unknown as TokenQueryBuilder<T>;
  }

  // Internal: build the combined filter
  private buildCompiledFilter(): CompiledFilter {
    if (this.filters.length === 0) {
      return this.negated ? () => false : () => true;
    }

    // Group filters by combinator
    let result: CompiledFilter = this.filters[0].filter;

    for (let i = 1; i < this.filters.length; i++) {
      const node = this.filters[i];
      if (node.combinator === "and") {
        result = combineFiltersAnd(result, node.filter);
      } else {
        result = combineFiltersOr(result, node.filter);
      }
    }

    return this.negated ? negateFilter(result) : result;
  }

  // Terminal operations
  private *executeQuery(): Generator<T> {
    const filter = this.buildCompiledFilter();
    let skipped = 0;
    let taken = 0;

    // If sorting is needed, we need to collect and sort first
    if (this.sortFn) {
      const collected: T[] = [];
      for (const token of this.source()) {
        if (filter(token)) {
          collected.push(token as T);
        }
      }
      collected.sort(this.sortFn);

      for (const token of collected) {
        if (skipped < this.skipCount) {
          skipped++;
          continue;
        }
        if (this.takeCount !== undefined && taken >= this.takeCount) {
          break;
        }
        yield token;
        taken++;
      }
    } else {
      for (const token of this.source()) {
        if (filter(token)) {
          if (skipped < this.skipCount) {
            skipped++;
            continue;
          }
          if (this.takeCount !== undefined && taken >= this.takeCount) {
            break;
          }
          yield token as T;
          taken++;
        }
      }
    }
  }

  toArray(): T[] {
    return Array.from(this.executeQuery());
  }

  toIterator(): IterableIterator<T> {
    return this.executeQuery();
  }

  toMap(): Map<string, T> {
    const map = new Map<string, T>();
    for (const token of this.executeQuery()) {
      map.set(token.path, token);
    }
    return map;
  }

  groupByType(): Map<TokenType, T[]> {
    const groups = new Map<TokenType, T[]>();
    for (const token of this.executeQuery()) {
      const existing = groups.get(token.type);
      if (existing) {
        existing.push(token);
      } else {
        groups.set(token.type, [token]);
      }
    }
    return groups;
  }

  first(): T | undefined {
    for (const token of this.executeQuery()) {
      return token;
    }
    return undefined;
  }

  count(): number {
    let count = 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _ of this.executeQuery()) {
      count++;
    }
    return count;
  }

  exists(): boolean {
    return this.first() !== undefined;
  }

  forEach(callback: (token: T) => void): void {
    for (const token of this.executeQuery()) {
      callback(token);
    }
  }

  map<U>(mapper: (token: T) => U): U[] {
    const results: U[] = [];
    for (const token of this.executeQuery()) {
      results.push(mapper(token));
    }
    return results;
  }

  reduce<U>(reducer: (acc: U, token: T) => U, initial: U): U {
    let acc = initial;
    for (const token of this.executeQuery()) {
      acc = reducer(acc, token);
    }
    return acc;
  }
}

/**
 * Create a new TokenQueryBuilder from a source iterator
 */
export function createQueryBuilder<T extends ProcessedToken = ProcessedToken>(
  source: () => IterableIterator<ProcessedToken>,
): TokenQueryBuilder<T> {
  return new TokenQueryBuilderImpl<T>(source);
}

/**
 * Create a query builder with an initial filter
 */
export function createFilteredQueryBuilder<T extends ProcessedToken = ProcessedToken>(
  source: () => IterableIterator<ProcessedToken>,
  filter: TokenFilter,
): TokenQueryBuilder<T> {
  const builder = new TokenQueryBuilderImpl<T>(source);
  return builder.where(compileFilter(filter) as (token: T) => boolean);
}
