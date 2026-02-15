import { isTokenAlias } from "../../../guards";
import type {
  AddTokenAction,
  ExtensionContext,
  ProcessedToken,
  ProcessorExtension,
  RemoveTokenAction,
  TokenAction,
  TokenFilter,
} from "../../types";

/**
 * Responsive modifier type
 */
export type ResponsiveModifier = "up" | "down" | "between" | "only";

/**
 * Default breakpoints
 */
export const DEFAULT_BREAKPOINTS: Record<string, string> = {
  xs: "0px",
  sm: "600px",
  md: "960px",
  lg: "1280px",
  xl: "1920px",
  xxl: "2560px",
};

/**
 * Normalize a breakpoint value
 */
function normalizeBp(bp: string): string {
  // If the bp is a number followed by any unit, return it as is
  // Otherwise use px as default
  return /^-?\d+(\.\d+)?[a-zA-Z%]+$/g.test(bp) ? bp : `${bp}px`;
}

/**
 * Generate media query for "up" modifier (min-width)
 */
function up(breakpoint: string, breakpoints: Record<string, string>): string {
  const bp = breakpoints[breakpoint];
  return `@media (width >= ${bp})`;
}

/**
 * Generate media query for "down" modifier (max-width)
 */
function down(breakpoint: string, breakpoints: Record<string, string>): string {
  const bp = breakpoints[breakpoint];
  return `@media (width <= ${bp})`;
}

/**
 * Generate media query for "between" modifier
 */
function between(start: string, end: string, breakpoints: Record<string, string>): string {
  const bpStart = breakpoints[start];
  const bpEnd = breakpoints[end];
  return `@media (${bpStart} <= width <= ${bpEnd})`;
}

/**
 * Generate media query for "only" modifier (exact width)
 */
function only(breakpoint: string, breakpoints: Record<string, string>): string {
  const bp = breakpoints[breakpoint];
  return `@media (width: ${bp})`;
}

/**
 * Default path to breakpoint name extractor
 */
function defaultPathToBreakpoint(path: string): string {
  const key = path.split(".").pop() as string;
  return key.replaceAll("@", "").replaceAll("_", "").replaceAll("-", "");
}

/**
 * Options for responsive extension
 */
export interface ResponsiveExtensionOptions {
  filter: TokenFilter;
  breakpoints?: Record<string, string>;
  pathToBreakpoint?: (path: string) => string;
  type?: ResponsiveModifier;
  base?: string;
}

/**
 * Create a responsive extension
 *
 * This extension groups tokens by breakpoint and generates responsive
 * token sets with media queries. It uses the onPostProcess hook to
 * analyze all matching tokens and combine them into responsive tokens.
 */
export function responsiveExtension(options: ResponsiveExtensionOptions): ProcessorExtension {
  const {
    filter,
    breakpoints = DEFAULT_BREAKPOINTS,
    type = "up",
    base = "xs",
    pathToBreakpoint = defaultPathToBreakpoint,
  } = options;

  return {
    name: "responsive",
    filter,
    priority: -10, // Run late, after other extensions

    onPostProcess(tokens: ProcessedToken[], context: ExtensionContext): TokenAction[] {
      // Group tokens by parent path
      const groups = new Map<string, ProcessedToken[]>();

      for (const token of tokens) {
        const parentPath = token.group;
        const existing = groups.get(parentPath);
        if (existing) {
          existing.push(token);
        } else {
          groups.set(parentPath, [token]);
        }
      }

      const actions: TokenAction[] = [];

      // Process each group
      for (const [parentPath, groupTokens] of groups) {
        if (groupTokens.length < 2) {
          // Need at least 2 tokens for responsive grouping
          continue;
        }

        // Normalize breakpoints (resolve aliases if needed)
        const normalizedBreakpoints: Record<string, string> = {};
        for (const [key, value] of Object.entries(breakpoints)) {
          normalizedBreakpoints[pathToBreakpoint(key)] = normalizeBp(
            isTokenAlias(value) ? String(context.resolveAlias(value)) : value,
          );
        }

        // Build responsive payload
        const responsivePayload: Record<string, Record<string, unknown>> = {};
        const tokensToRemove: string[] = [];

        for (const token of groupTokens) {
          const bpKey = pathToBreakpoint(token.path);
          tokensToRemove.push(token.path);

          if (bpKey === pathToBreakpoint(base)) {
            responsivePayload["base"] = token.modeValues;
            continue;
          }

          let mediaQuery: string;
          switch (type) {
            case "up":
              mediaQuery = up(bpKey, normalizedBreakpoints);
              break;
            case "down":
              mediaQuery = down(bpKey, normalizedBreakpoints);
              break;
            case "between":
              mediaQuery = between(base, bpKey, normalizedBreakpoints);
              break;
            case "only":
              mediaQuery = only(bpKey, normalizedBreakpoints);
              break;
          }

          responsivePayload[mediaQuery] = token.modeValues;
        }

        // Only create responsive token if we have a base and at least one breakpoint
        if (responsivePayload["base"] && Object.keys(responsivePayload).length > 1) {
          // Get the type from the first token
          const firstToken = groupTokens[0];

          // Remove individual breakpoint tokens
          const removeAction: RemoveTokenAction = {
            type: "remove",
            paths: tokensToRemove,
          };
          actions.push(removeAction);

          // Add combined responsive token
          const baseValue =
            responsivePayload["base"][context.modes.defaultMode] ??
            Object.values(responsivePayload["base"])[0];
          const addAction: AddTokenAction = {
            type: "add",
            path: parentPath,
            token: {
              $type: firstToken.type as "color",
              $value: baseValue as string,
            },
            modeValues: responsivePayload as Record<string, unknown>,
            generatedBy: "responsive",
          };
          actions.push(addAction);
        }
      }

      return actions;
    },
  };
}
