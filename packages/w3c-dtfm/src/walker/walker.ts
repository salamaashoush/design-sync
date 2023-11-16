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

export type TokenWalkerFn<T> = (data: ProcessedDesignToken) => T;

export const DEFAULT_MODE = 'default';

interface TokensWalkerOptions {
  extensions?: TokensWalkerExtension[];
  normalizeValue?: boolean;
}
export class TokensWalker {
  private readonly extensions: TokensWalkerExtension[];
  constructor(
    private tokens: Record<string, unknown> = {},
    private options: TokensWalkerOptions = {},
  ) {
    this.extensions = [
      new ColorGeneratorsExtension(this),
      new ColorModifiersExtension(this),
      ...(this.options.extensions ?? []),
    ];
  }

  getTokens() {
    return this.tokens;
  }

  setTokens(tokens: Record<string, unknown>) {
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

  getName() {
    const n = this.tokens.$name;
    if (typeof n === 'string') {
      return n;
    }
    return Object.keys(this.tokens)[0];
  }

  getVersion() {
    const v = this.tokens.$version;
    if (typeof v === 'string') {
      return v;
    }
    return '0.0.0';
  }

  getDescription() {
    const d = this.tokens.$description;
    if (typeof d === 'string') {
      return d;
    }
    return '';
  }

  get(path: string) {
    return get(this.tokens, path);
  }

  derefTokenValue(tokenValue: unknown): unknown {
    if (!tokenValue) {
      return tokenValue;
    }

    if (isTokenAlias(tokenValue)) {
      const tokenPath = normalizeTokenAlias(tokenValue);
      const value = this.get(tokenPath);
      return this.derefTokenValue(value.$value);
    }

    // for composite tokens, we need to deref the values of the subtokens
    if (isObject(tokenValue) && !Array.isArray(tokenValue)) {
      return Object.entries(tokenValue).reduce(
        (acc, [key, value]) => {
          acc[key] = this.derefTokenValue(value);
          return acc;
        },
        {} as Record<string, unknown>,
      );
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

  walk<T = void>(walker: TokenWalkerFn<T>, normalize = this.options.normalizeValue) {
    this.walkTokensHelper(this.tokens, '', walker, normalize);
  }

  map<T>(mapper: TokenWalkerFn<T>, normalize = this.options.normalizeValue) {
    const results: T[] = [];
    this.walk((token) => {
      results.push(mapper(token));
    }, normalize);
  }

  filter(predicate: TokenWalkerFn<boolean>, normalize = this.options.normalizeValue) {
    const results: ProcessedDesignToken[] = [];
    this.walk((token) => {
      if (predicate(token)) {
        results.push(token);
      }
    }, normalize);
    return results;
  }

  reduce<T>(
    reducer: (acc: T, token: ProcessedDesignToken) => T,
    initialValue: T,
    normalize = this.options.normalizeValue,
  ) {
    let acc = initialValue;
    this.walk((token) => {
      acc = reducer(acc, token);
    }, normalize);
    return acc;
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

  private buildTokenValueByMode(token: DesignToken, normalize: boolean) {
    const { requiredModes, defaultMode } = this.getModes();
    const valueByMode: ProcessedDesignToken['valueByMode'] = {
      [defaultMode]: {
        normalized: this.normalizeTokenValue(token.$value),
        raw: token.$value,
      },
    };
    for (const mode of requiredModes) {
      if (hasModeExtension(token)) {
        const modeValue = token.$extensions.mode[mode] || token.$value;
        valueByMode[mode] = normalize
          ? {
              normalized: this.normalizeTokenValue(modeValue),
              raw: modeValue,
            }
          : modeValue;
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

  private buildWalkerContext(token: DesignToken, fullPath: string, normalize = false): ProcessedDesignToken {
    const { $type: type, $value: raw, $description: description } = token;
    const normalized = normalize ? this.normalizeTokenValue(raw) : raw;
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
      valueByMode: this.buildTokenValueByMode(token, normalize),
    };
  }

  private walkTokensHelper(tokens: object, path = '', walker: TokenWalkerFn<void>, normalize = false) {
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
            walker(this.buildWalkerContext(token, `${currentPath}.${groupKey}`, normalize));
          } else {
            // If the group token doesn't have a $value, treat it as another group or single token
            this.walkTokensHelper({ [groupKey]: groupToken }, `${currentPath}.${groupKey}`, walker);
          }
        }
      } else if (isDesignToken(token)) {
        walker(this.buildWalkerContext(token, currentPath, normalize));
      } else if (isObject(token)) {
        // If the token isn't recognized as a group or single token, recurse into it to check its children
        this.walkTokensHelper(token, currentPath, walker);
      }
    }
  }
}
