import { hasTokenExtensions } from "../../guards";
import { normalizeColorValue } from "../../normalize";
import { ColorTokenModifier, WithExtension } from "../../types";
import {
  TokensWalkerSchemaExtension,
  type DesignTokenValueByMode,
  type TokensWalkerAction,
} from "../types";
import { getModeNormalizeValue, isMatchingTokensFilter } from "../utils";
import { hasGeneratorsExtension } from "./generators";

export interface ColorTokenModifiersExtension {
  modifiers: ColorTokenModifier[];
}
export function hasColorTokenModifiersExtension(
  value: unknown,
): value is WithExtension<ColorTokenModifiersExtension> {
  return (
    hasTokenExtensions(value) &&
    "modifiers" in value.$extensions &&
    Array.isArray(value.$extensions.modifiers) &&
    value.$extensions.modifiers.length > 0
  );
}

const defaultFilter = {
  type: "color",
} as const;
export interface ColorModifiersExtensionOptions {
  filter?: TokensWalkerSchemaExtension["filter"];
}

export function colorModifiersExtension({
  filter = defaultFilter,
}: ColorModifiersExtensionOptions = {}): TokensWalkerSchemaExtension {
  return {
    name: "default-color-modifiers-extension",
    filter: (params) => hasGeneratorsExtension(params[1]) && isMatchingTokensFilter(params, filter),
    run(token): TokensWalkerAction[] {
      const modifiers = token.extensions?.modifiers as ColorTokenModifier[];
      const payload: DesignTokenValueByMode = {};
      for (const mode of Object.keys(token.valueByMode)) {
        payload[mode] = normalizeColorValue(
          getModeNormalizeValue(token.valueByMode, mode),
          modifiers,
        );
      }

      return [
        {
          extension: "default-color-modifiers-extension",
          type: "update",
          path: token.path,
          payload,
        },
      ];
    },
  };
}
