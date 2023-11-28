import { get, toArray } from '@design-sync/utils';
import { normalizeTokenAlias } from '../alias';
import {
  hasModeExtension,
  hasModesExtension,
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
import { colorGeneratorsExtension } from './extensions/generators';
import { colorModifiersExtension } from './extensions/modifiers';
import type {
  ProcessedDesignToken,
  TokensWalkerExtension,
  TokensWalkerExtensionAction,
  TokensWalkerFilter,
} from './types';
import { isMatchingTokensFilter, isSupportedTypeFilter } from './utils';

export type TokenIterator<T> = (data: ProcessedDesignToken) => T;
type Walker = (token: DesignToken, path: string) => void;

export const DEFAULT_MODE = 'default';

interface TokensWalkerOptions {
  disabledDefaultExtensions?: boolean;
  extensions?: TokensWalkerExtension[];
  normalizeValue?: boolean;
  requiredModes?: string[];
  defaultMode?: string;
  filter?: TokensWalkerFilter;
}

export class TokensWalker {
  private extensions: TokensWalkerExtension[];
  private _rootKey!: string;
  private options: Required<TokensWalkerOptions>;
  private tokens: Map<string, ProcessedDesignToken> = new Map();

  constructor(
    private tokensObj: Record<string, unknown> = {},
    options: TokensWalkerOptions = {},
  ) {
    this.options = {
      extensions: options.extensions ?? [],
      normalizeValue: options.normalizeValue ?? true,
      requiredModes: options.requiredModes ?? [],
      defaultMode: options.defaultMode ?? DEFAULT_MODE,
      disabledDefaultExtensions: options.disabledDefaultExtensions ?? false,
      filter: options.filter ?? isSupportedTypeFilter,
    };
    this.extensions = this.options.disabledDefaultExtensions
      ? []
      : [colorModifiersExtension(), colorGeneratorsExtension()];

    if (this.options.extensions) {
      this.extensions.push(...this.options.extensions);
    }
    this.processTokens();
  }

  [Symbol.iterator]() {
    return this.tokens.values();
  }

  use(extension: TokensWalkerExtension | TokensWalkerExtension[]) {
    const extensions = toArray(extension);
    for (const extension of extensions) {
      if (this.extensions.some((e) => e.name === extension.name)) {
        console.warn(`Extension ${extension.name} already registered`);
        continue;
      }
      this.extensions.push(extension);
    }
  }

  walk(iterator: TokenIterator<void>) {
    for (const token of this.tokens.values()) {
      iterator(token);
    }
  }

  map<T>(iterator: TokenIterator<T>) {
    const results = [] as T[];
    for (const token of this.tokens.values()) {
      results.push(iterator(token));
    }
    return results;
  }

  filter(iterator: TokenIterator<boolean>) {
    const results = [] as ProcessedDesignToken[];
    for (const token of this.tokens.values()) {
      if (iterator(token)) {
        results.push(token);
      }
    }
    return results;
  }

  reduce<T>(iterator: (acc: T, token: ProcessedDesignToken) => T, initialValue: T) {
    let result = initialValue;
    for (const token of this.tokens.values()) {
      result = iterator(result, token);
    }
    return result;
  }

  find(predicate: TokenIterator<boolean>) {
    for (const token of this.tokens.values()) {
      if (predicate(token)) {
        return token;
      }
    }
    return undefined;
  }

  getTokens() {
    return this.tokens.values();
  }

  setTokens(tokens: Record<string, unknown>) {
    this.tokensObj = tokens;
    this.processTokens();
  }

  setOptions(options: TokensWalkerOptions) {
    this.options = {
      ...this.options,
      ...options,
    };
  }

  disableDefaultExtensions() {
    this.options.disabledDefaultExtensions = true;
    this.extensions = this.extensions.filter((e) => e.name.startsWith('default-') === false) as TokensWalkerExtension[];
  }

  getModes(): Required<ModesExtension['modes']> {
    const modes = {
      requiredModes: this.options.requiredModes,
      defaultMode: this.options.defaultMode,
    };
    if (!hasModesExtension(this.tokensObj)) {
      return modes;
    }
    modes.requiredModes = this.tokensObj.$extensions.modes.requiredModes || modes.requiredModes;
    modes.defaultMode = this.tokensObj.$extensions.modes.defaultMode || modes.defaultMode;
    return modes;
  }

  getName() {
    const n = this.tokensObj.$name;
    if (typeof n === 'string') {
      return n;
    }

    const keys = Object.keys(this.tokensObj)
      .filter((k) => !k.startsWith('$') && typeof this.tokensObj[k] === 'object')
      .sort();
    this._rootKey = keys[0];
    return this._rootKey;
  }

  getVersion() {
    const v = this.tokensObj.$version;
    if (typeof v === 'string') {
      return v;
    }
    return '0.0.0';
  }

  getDescription() {
    const d = this.tokensObj.$description;
    if (typeof d === 'string') {
      return d;
    }
    return '';
  }

  get(path: string) {
    return get(this.tokensObj, path);
  }

  derefTokenValue(tokenValue: unknown): unknown {
    if (!tokenValue) {
      return tokenValue;
    }

    if (isTokenAlias(tokenValue)) {
      const tokenPath = normalizeTokenAlias(tokenValue);
      const token = this.get(tokenPath);
      return this.derefTokenValue(token.$value);
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

  private processTokens() {
    this.walkTokens(this.tokensObj, '', (token, path) => {
      if (isMatchingTokensFilter([path, token], this.options.filter)) {
        const processed = this.processToken(token, path, this.options.normalizeValue);
        this.tokens.set(processed.path, processed);
      }
    });
    for (const token of this.tokens.values()) {
      this.processTokenActions(token);
    }
  }

  private processTokenActions(token: ProcessedDesignToken) {
    const actions = this.runTokenExtensions(token);
    for (const action of actions) {
      switch (action.type) {
        case 'add':
          this.tokens.set(action.path, {
            ...token,
            path: action.path,
            valueByMode: action.payload,
            isResponsive: action.isResponsive,
            isGenerated: true,
          });
          break;
        case 'update':
          this.tokens.set(action.path, {
            ...this.tokens.get(action.path)!,
            valueByMode: action.payload,
            isResponsive: action.isResponsive,
            isGenerated: true,
          });
          break;
        case 'remove':
          toArray(action.path).forEach((path) => {
            this.tokens.delete(path);
          });
          break;
      }
    }
  }

  private runTokenExtensions(token: ProcessedDesignToken) {
    const extensions = this.extensions.filter((e) => isMatchingTokensFilter([token.path, token.original], e.filter));
    if (extensions.length === 0) {
      return [];
    }
    const actions = [] as TokensWalkerExtensionAction[];
    for (const extension of extensions) {
      actions.push(...extension.run(token, this));
    }
    return actions;
  }

  private buildTokenValueByMode(token: DesignToken, normalize: boolean) {
    const { requiredModes, defaultMode } = this.getModes();
    const valueByMode: ProcessedDesignToken['valueByMode'] = {
      [defaultMode]: normalize
        ? {
            normalized: this.normalizeTokenValue(token.$value),
            raw: token.$value,
          }
        : token.$value,
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

  private processToken(original: DesignToken, path: string, normalize = this.options.normalizeValue) {
    return {
      original,
      path,
      normalizedValue: normalize ? this.normalizeTokenValue(original.$value) : undefined,
      type: original.$type,
      rawValue: original.$value,
      description: original.$description,
      extensions: original.$extensions,
      valueByMode: this.buildTokenValueByMode(original, normalize),
    };
  }

  private walkTokens(tokens: object, path = '', walker: Walker) {
    for (const [key, token] of Object.entries(tokens)) {
      const currentPath = path ? `${path}.${key}` : key;
      if (isDesignTokenGroup(token)) {
        const groupType = token.$type;
        // Remove the $type key to avoid processing it as a child token
        const { $type, ...tokenWithoutType } = token;
        // Recursively normalize the tokens inside the group
        for (const [groupKey, groupToken] of Object.entries(tokenWithoutType)) {
          if (!isObject(groupToken)) {
            continue;
          }
          const groupTokenWithType = {
            $type: groupType,
            ...groupToken,
          };
          if (isDesignTokenLike(groupTokenWithType)) {
            walker(groupTokenWithType as DesignToken, `${currentPath}.${groupKey}`);
          } else {
            // If the group token doesn't have a $value, treat it as another group or single token
            this.walkTokens(
              {
                [groupKey]: groupTokenWithType,
              },
              currentPath,
              walker,
            );
          }
        }
      } else if (isDesignToken(token)) {
        walker(token, currentPath);
      } else if (isObject(token)) {
        // If the token isn't recognized as a group or single token, recurse into it to check its children
        this.walkTokens(token, currentPath, walker);
      }
    }
  }
}
