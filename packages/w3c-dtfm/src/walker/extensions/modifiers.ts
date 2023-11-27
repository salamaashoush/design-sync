import { hasTokenExtensions } from '../../guards';
import { normalizeColorValue } from '../../normalize';
import { ColorModifier, WithExtension } from '../../types';
import {
  TokensWalkerExtension,
  type DesignTokenValueByMode,
  type ProcessedDesignToken,
  type TokensWalkerExtensionAction,
} from '../types';
import { getModeNormalizeValue, isMatchTokenExtensionFilter } from '../utils';
import { hasGeneratorsExtension } from './generators';

export interface ColorTokenModifier {
  type: ColorModifier;
  value: string | number | Record<string, string | number>;
}
export interface ColorTokenModifiersExtension {
  modifiers: ColorTokenModifier[];
}
export function hasColorTokenModifiersExtension(value: unknown): value is WithExtension<ColorTokenModifiersExtension> {
  return (
    hasTokenExtensions(value) &&
    'modifiers' in value.$extensions &&
    Array.isArray(value.$extensions.modifiers) &&
    value.$extensions.modifiers.length > 0
  );
}

const defaultFilter = {
  type: 'color',
} as const;
export interface ColorModifiersExtensionOptions {
  filter?: TokensWalkerExtension['filter'];
}

export function colorModifiersExtension({
  filter = defaultFilter,
}: ColorModifiersExtensionOptions = {}): TokensWalkerExtension {
  return {
    name: 'default-color-modifiers-extension',
    filter: (token: ProcessedDesignToken) =>
      hasGeneratorsExtension(token.original) && isMatchTokenExtensionFilter(token, filter),

    run(token: ProcessedDesignToken): TokensWalkerExtensionAction[] {
      const modifiers = token.extensions?.modifiers as ColorTokenModifier[];
      const payload: DesignTokenValueByMode = {};
      for (const mode of Object.keys(token.valueByMode)) {
        payload[mode] = normalizeColorValue(getModeNormalizeValue(token.valueByMode, mode), modifiers);
      }

      return [
        {
          extension: 'default-color-modifiers-extension',
          type: 'update',
          path: token.path,
          payload,
        },
      ];
    },
  };
}
