import { normalizeColorValue } from '../../normalize';
import {
  TokensWalkerExtension,
  type DesignTokenValueByMode,
  type ProcessedDesignToken,
  type TokensWalkerExtensionAction,
} from '../types';
import { getModeNormalizeValue } from '../utils';

export class ColorModifiersExtension extends TokensWalkerExtension {
  public name = 'color-modifiers-extension';
  public target = 'color' as const;

  run(token: ProcessedDesignToken): TokensWalkerExtensionAction[] {
    const modifiers = token.extensions.modifiers;
    if (modifiers.length === 0) {
      return [];
    }
    const payload: DesignTokenValueByMode = {};
    for (const mode of Object.keys(token.valueByMode)) {
      payload[mode] = normalizeColorValue(getModeNormalizeValue(token.valueByMode, mode), modifiers);
    }

    return [
      {
        type: 'update',
        path: token.fullPath,
        payload,
      },
    ];
  }
}
