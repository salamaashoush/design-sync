import { get } from '@design-sync/utils';
import { normalizeTokenAlias } from '../alias';
import {
  hasGeneratorsExtension,
  hasModeExtension,
  hasModesExtension,
  hasModifiersExtension,
  isDesignToken,
  isDesignTokenGroup,
  isDesignTokenLike,
  isObject,
  isTokenAlias,
} from '../guards';
import {
  normalizeBorderValue,
  normalizeColorValue,
  normalizeCubicBezierValue,
  normalizeDimensionValue,
  normalizeDurationValue,
  normalizeFontFamilyValue,
  normalizeFontWeightValue,
  normalizeGradientValue,
  normalizeShadowValue,
  normalizeStrokeStyleValue,
  normalizeTransitionValue,
  normalizeTypographyValue,
} from '../normalize';
import type { DesignToken, ModesExtension } from '../types';
import { ColorGeneratorsExtension } from './extensions/generators';
import { ColorModifiersExtension } from './extensions/modifiers';
import type {
  ProcessedDesignToken,
  TokenExtensions,
  TokensWalkerExtension,
  TokensWalkerExtensionAction,
} from './types';

export type TokenWalkerFn = (data: ProcessedDesignToken, walker: TokensWalker) => void;

export const DEFAULT_MODE = 'default';
export class TokensWalker {
  private readonly extensions: TokensWalkerExtension[];
  constructor(
    private tokens: Record<string, any> = {},
    extensions: TokensWalkerExtension[] = [],
  ) {
    this.extensions = [new ColorGeneratorsExtension(this), new ColorModifiersExtension(this), ...extensions];
  }

  getTokens() {
    return this.tokens;
  }

  setTokens(tokens: Record<string, any>) {
    this.tokens = tokens;
  }

  getModes(): Required<ModesExtension['modes']> {
    if (!hasModesExtension(this.tokens)) {
      return {
        defaultMode: DEFAULT_MODE,
        requiredModes: [],
      };
    }

    return {
      requiredModes: this.tokens.$extensions.modes.requiredModes || [],
      defaultMode: this.tokens.$extensions.modes.defaultMode || DEFAULT_MODE,
    };
  }

  getToken(path: string) {
    return get(this.tokens, path);
  }

  derefTokenValue(tokenValue: unknown): unknown {
    if (!tokenValue) {
      return tokenValue;
    }

    if (isTokenAlias(tokenValue)) {
      const tokenPath = normalizeTokenAlias(tokenValue);
      const value = this.getToken(tokenPath);
      return this.derefTokenValue(value.$value);
    }

    // for composite tokens, we need to deref the values of the subtokens
    if (isObject(tokenValue) && !Array.isArray(tokenValue)) {
      return Object.entries(tokenValue).reduce((acc, [key, value]) => {
        acc[key] = this.derefTokenValue(value);
        return acc;
      }, {} as any);
    }

    return tokenValue;
  }

  normalizeTokenValue(tokenValue: unknown) {
    const resolvedTokenValue = this.derefTokenValue(tokenValue);
    switch (resolvedTokenValue) {
      case 'color':
        return normalizeColorValue(resolvedTokenValue);
      case 'border':
        return normalizeBorderValue(resolvedTokenValue);
      case 'dimension':
        return normalizeDimensionValue(resolvedTokenValue);
      case 'typography':
        return normalizeTypographyValue(resolvedTokenValue);
      case 'shadow':
        return normalizeShadowValue(resolvedTokenValue);
      case 'cubicBezier':
        return normalizeCubicBezierValue(resolvedTokenValue);
      case 'fontFamily':
        return normalizeFontFamilyValue(resolvedTokenValue);
      case 'fontWeight':
        return normalizeFontWeightValue(resolvedTokenValue);
      case 'transition':
        return normalizeTransitionValue(resolvedTokenValue);
      case 'duration':
        return normalizeDurationValue(resolvedTokenValue);
      case 'strokeStyle':
        return normalizeStrokeStyleValue(resolvedTokenValue);
      case 'gradient':
        return normalizeGradientValue(resolvedTokenValue);
    }
    return resolvedTokenValue;
  }

  walkTokens(walker: TokenWalkerFn) {
    this.walkTokensHelper(this.tokens, '', walker);
  }

  runTokenExtensions(token: ProcessedDesignToken) {
    if (token.extensions.generators.length === 0 && token.extensions.modifiers.length === 0) {
      return [];
    }
    if (!this.extensions.some((e) => e.target === token.type)) {
      return [];
    }
    const actions: TokensWalkerExtensionAction[] = [];
    for (const extension of this.extensions) {
      if (extension.target === token.type) {
        actions.push(...extension.run(token));
      }
    }
    return actions;
  }

  private buildTokenValueByMode(token: DesignToken) {
    const { requiredModes, defaultMode } = this.getModes();
    const valueByMode: ProcessedDesignToken['valueByMode'] = {
      [defaultMode]: {
        normalized: this.normalizeTokenValue(token.$value),
        raw: token.$value,
      },
    };
    for (const mode of requiredModes) {
      if (hasModeExtension(token)) {
        valueByMode[mode] = {
          normalized: this.normalizeTokenValue(token.$extensions.mode[mode] || token.$value),
          raw: token.$extensions.mode[mode] || token.$value,
        };
      }
    }
    return valueByMode;
  }

  private buildTokenExtensions(token: DesignToken): TokenExtensions {
    const extensions: TokenExtensions = {
      generators: [],
      modifiers: [],
    };
    if (hasGeneratorsExtension(token)) {
      extensions.generators = token.$extensions.generators;
    }
    if (hasModifiersExtension(token)) {
      extensions.modifiers = token.$extensions.modifiers;
    }
    return extensions;
  }

  private buildWalkerContext(token: DesignToken, fullPath: string): ProcessedDesignToken {
    const { $type: type, $value: raw, $description: description } = token;
    const normalized = this.normalizeTokenValue(raw);
    const parts = fullPath.split('.');
    const key = parts.pop() as string;
    const parentPath = parts.join('.');
    return {
      normalized,
      type,
      raw,
      description,
      fullPath,
      parentPath,
      key,
      extensions: this.buildTokenExtensions(token),
      valueByMode: this.buildTokenValueByMode(token),
    };
  }

  private walkTokensHelper(tokens: object, path = '', walker: TokenWalkerFn) {
    for (const [key, token] of Object.entries(tokens)) {
      const currentPath = path ? `${path}.${key}` : key;
      if (isDesignTokenGroup(token)) {
        const groupType = token.$type;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore-next-line
        delete token.$type; // Remove the $type key to avoid processing it as a child token
        // Recursively normalize the tokens inside the group
        for (const [groupKey, groupToken] of Object.entries(token)) {
          if (isDesignTokenLike(groupToken)) {
            const token = {
              ...groupToken,
              $type: groupType,
            } as DesignToken;
            walker(this.buildWalkerContext(token, `${currentPath}.${groupKey}`), this);
          } else {
            // If the group token doesn't have a $value, treat it as another group or single token
            this.walkTokensHelper({ [groupKey]: groupToken }, `${currentPath}.${groupKey}`, walker);
          }
        }
      } else if (isDesignToken(token)) {
        walker(this.buildWalkerContext(token, currentPath), this);
      } else if (isObject(token)) {
        // If the token isn't recognized as a group or single token, recurse into it to check its children
        this.walkTokensHelper(token, currentPath, walker);
      }
    }
  }
}
