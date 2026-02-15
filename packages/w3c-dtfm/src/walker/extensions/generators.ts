import { hasTokenExtensions } from "../../guards";
import { normalizeColorValue } from "../../normalize/color";
import type { ColorModifier, WithExtension } from "../../types";
import { WalkerDesignToken } from "../token";
import { DesignTokenValueByMode, TokensWalkerAction, TokensWalkerSchemaExtension } from "../types";
import { getModeNormalizeValue, isMatchingTokensFilter } from "../utils";
import { TokensWalker } from "../walker";

export interface TokenGenerator {
  type: ColorModifier;
  value: Record<
    string,
    | number
    | {
        value: number;
        base: string;
      }
  >;
}
export interface TokenGeneratorsExtension {
  generators: TokenGenerator[];
}

export function hasGeneratorsExtension(
  value: unknown,
): value is WithExtension<TokenGeneratorsExtension> {
  return (
    hasTokenExtensions(value) &&
    "generators" in value.$extensions &&
    Array.isArray(value.$extensions.generators) &&
    value.$extensions.generators.length > 0
  );
}

function runGenerator(
  generator: TokenGenerator,
  token: WalkerDesignToken,
  walker: TokensWalker,
  results: TokensWalkerAction[] = [],
) {
  const modes = Object.keys(token.valueByMode);
  for (const [key, value] of Object.entries(generator.value)) {
    const path = `${token.path}${key}`;
    const payload = {} as DesignTokenValueByMode;
    for (const mode of modes) {
      const normalizedValue = getModeNormalizeValue(token.valueByMode, mode);
      const baseColor =
        typeof value === "number"
          ? normalizedValue
          : value.base
            ? walker.derefTokenValue(value.base)
            : normalizedValue;
      const amount = typeof value === "number" ? value : value.value;
      payload[mode] = normalizeColorValue(baseColor, {
        type: generator.type,
        value: amount,
      });
      results.push({
        extension: "default-color-generators-extension",
        type: "add",
        path,
        payload,
      });
    }
  }
  return results;
}

interface ColorGeneratorsExtensionOptions {
  filter?: TokensWalkerSchemaExtension["filter"];
}

const defaultFilter = {
  type: "color",
} as const;
export function colorGeneratorsExtension({
  filter = defaultFilter,
}: ColorGeneratorsExtensionOptions = {}): TokensWalkerSchemaExtension {
  return {
    name: "default-color-generators-extension",
    filter: (params) => hasGeneratorsExtension(params[1]) && isMatchingTokensFilter(params, filter),
    run(token, walker): TokensWalkerAction[] {
      const generators = token.extensions?.generators as TokenGenerator[];
      const results: TokensWalkerAction[] = [];
      for (const generator of generators) {
        runGenerator(generator, token, walker, results);
      }
      return results;
    },
  };
}
