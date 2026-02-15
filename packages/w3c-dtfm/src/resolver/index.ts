/**
 * Token Resolver
 *
 * W3C-compliant token resolution following the 4-stage algorithm.
 *
 * @see https://www.w3.org/community/reports/design-tokens/CG-FINAL-resolver-20251028/
 */

export * from "./errors";
export * from "./references";
export * from "./stages";

import { runResolver, type ResolverOptions, type DependencyGraph } from "./stages";
import type { ResolverResult } from "./errors";

/**
 * TokenResolver class for object-oriented usage
 */
export class TokenResolver {
  private tokens: Record<string, unknown>;
  private options: ResolverOptions;
  private result?: ResolverResult<Record<string, unknown>>;
  private graph?: DependencyGraph;

  constructor(tokens: Record<string, unknown>, options: ResolverOptions = {}) {
    this.tokens = tokens;
    this.options = options;
  }

  /**
   * Resolve all tokens
   */
  resolve(): ResolverResult<Record<string, unknown>> {
    this.result = runResolver(this.tokens, this.options);
    return this.result;
  }

  /**
   * Get resolved tokens (runs resolve if not already done)
   */
  getResolvedTokens(): Record<string, unknown> | undefined {
    if (!this.result) {
      this.resolve();
    }
    return this.result?.value;
  }

  /**
   * Check if resolution was successful
   */
  isResolved(): boolean {
    return this.result?.success ?? false;
  }

  /**
   * Get resolution errors
   */
  getErrors() {
    return this.result?.errors ?? [];
  }

  /**
   * Get resolution warnings
   */
  getWarnings() {
    return this.result?.warnings ?? [];
  }

  /**
   * Update tokens and reset resolution state
   */
  setTokens(tokens: Record<string, unknown>) {
    this.tokens = tokens;
    this.result = undefined;
    this.graph = undefined;
  }

  /**
   * Update options
   */
  setOptions(options: ResolverOptions) {
    this.options = { ...this.options, ...options };
  }
}

/**
 * Resolve tokens (functional API)
 */
export function resolveTokens(
  tokens: Record<string, unknown>,
  options: ResolverOptions = {},
): ResolverResult<Record<string, unknown>> {
  return runResolver(tokens, options);
}

/**
 * Quick resolve - returns resolved tokens or throws on error
 */
export function resolveTokensOrThrow(
  tokens: Record<string, unknown>,
  options: Omit<ResolverOptions, "throwOnError"> = {},
): Record<string, unknown> {
  const result = runResolver(tokens, { ...options, throwOnError: true });
  return result.value!;
}

/**
 * Check if tokens can be resolved without errors
 */
export function canResolve(tokens: Record<string, unknown>): boolean {
  const result = runResolver(tokens, { validateInput: false });
  return result.success;
}
