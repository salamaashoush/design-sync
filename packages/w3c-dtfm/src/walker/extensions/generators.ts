import { normalizeColorValue } from '../../normalize';
import type { TokenGenerator } from '../../types';
import {
  DesignTokenValueByMode,
  ProcessedDesignToken,
  TokensWalkerExtension,
  TokensWalkerExtensionAction,
} from '../types';
import { getModeNormalizeValue } from '../utils';

export class ColorGeneratorsExtension extends TokensWalkerExtension {
  public name = 'color-generators-extension';
  public target = 'color' as const;

  run(token: ProcessedDesignToken): TokensWalkerExtensionAction[] {
    const generators = token.extensions.generators;
    if (generators.length === 0) {
      return [];
    }
    const results: TokensWalkerExtensionAction[] = [];
    for (const generator of generators) {
      this.runGenerator(generator, token, results);
    }
    return results;
  }

  private runGenerator(
    generator: TokenGenerator,
    token: ProcessedDesignToken,
    generated: TokensWalkerExtensionAction[],
  ) {
    const modes = Object.keys(token.valueByMode);
    for (const [key, value] of Object.entries(generator.value)) {
      const path = `${token.fullPath}${key}`;
      const payload = modes.reduce((acc, mode) => {
        const baseColor =
          typeof value === 'number'
            ? getModeNormalizeValue(token.valueByMode, mode)
            : this.walker.derefTokenValue(value.base);

        const amount = typeof value === 'number' ? value : value.value;
        acc[mode] = normalizeColorValue(baseColor, {
          type: generator.type,
          value: amount,
        });
        return acc;
      }, {} as DesignTokenValueByMode);
      generated.push({
        type: 'add',
        path,
        payload,
      });
    }
  }
}
