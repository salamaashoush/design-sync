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
import type { DesignToken, ModesExtension, TokenType } from '../types';
import { colorGeneratorsExtension } from './extensions/generators';
import { colorModifiersExtension } from './extensions/modifiers';
import { WalkerDesignToken } from './token';
import type {
  DesignTokenValueByMode,
  TokenOverrides,
  TokensWalkerAction,
  TokensWalkerFilter,
  TokensWalkerSchemaExtension,
} from './types';
import { getModeRawValue, isMatchingTokensFilter, isSupportedTypeFilter } from './utils';

export type TokenIterator<T> = (token: WalkerDesignToken) => T;
type Walker = (token: DesignToken, path: string) => void;

export const DEFAULT_MODE = 'default';

/**
 * options for the tokens walker
 */
export interface TokensWalkerOptions {
  /**
   * schema extensions to be applied to the tokens walker on top of the default schema extensions
   * @default []
   */
  schemaExtensions?: TokensWalkerSchemaExtension[];
  /**
   * disable default schema default extensions (color modifiers, color generators, etc..)
   * @default false
   */
  disableDefaultSchemaExtensions?: boolean;
  /**
   * dereference and normalize token values
   * @default true
   */
  normalizeTokenValue?: boolean;
  /**
   * required modes to be generated and processed by the plugins, if no provided, we generate only `defaultMode` mode
   * and modes schema extensions will be ignored
   * @default []
   */
  requiredModes?: string[];
  /**
   * which mode to use for the default token value, it will be used for naming the generated files
   * @default 'default'
   */
  defaultMode?: string;
  /**
   * filter tokens before they are processed by the plugins
   * @default isSupportedTypeFilter (only tokens with a supported type are processed)
   */
  filter?: TokensWalkerFilter;
  /**
   * override tokens by path during the build process, overrides are applied for all plugins, values are a function accepting the mode and returning the override value
   * @default undefined
   */
  overrides?: TokenOverrides;
}

export class TokensWalker {
  private schemaExtensions: TokensWalkerSchemaExtension[];
  private _rootKey!: string;
  private options: Required<TokensWalkerOptions>;
  private tokens: Map<string, WalkerDesignToken> = new Map();

  constructor(
    private tokensObj: Record<string, unknown> = {},
    options: TokensWalkerOptions = {},
  ) {
    this.options = {
      schemaExtensions: options.schemaExtensions ?? [],
      normalizeTokenValue: options.normalizeTokenValue ?? true,
      requiredModes: options.requiredModes ?? [],
      defaultMode: options.defaultMode ?? DEFAULT_MODE,
      disableDefaultSchemaExtensions: options.disableDefaultSchemaExtensions ?? false,
      filter: options.filter ?? isSupportedTypeFilter,
      overrides: options.overrides ?? {},
    };
    this.schemaExtensions = this.options.disableDefaultSchemaExtensions
      ? []
      : [colorModifiersExtension(), colorGeneratorsExtension()];

    if (this.options.schemaExtensions.length > 0) {
      this.use(this.options.schemaExtensions);
    }
    this.processTokens();
  }

  [Symbol.iterator]() {
    return this.tokens.values();
  }

  use(extension: TokensWalkerSchemaExtension | TokensWalkerSchemaExtension[]) {
    const extensions = toArray(extension);
    for (const extension of extensions) {
      if (this.schemaExtensions.some((e) => e.name === extension.name)) {
        console.warn(`Extension ${extension.name} already registered`);
        continue;
      }
      this.schemaExtensions.push(extension);
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
    const results = [] as WalkerDesignToken[];
    for (const token of this.tokens.values()) {
      if (iterator(token)) {
        results.push(token);
      }
    }
    return results;
  }

  reduce<T>(iterator: (acc: T, token: WalkerDesignToken) => T, initialValue: T) {
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
    for (const [key, value] of Object.entries(options)) {
      if (key === 'schemaExtensions' && value) {
        this.use(value);
        continue;
      }
      (this.options as any)[key] = value || (this.options as any)[key];
    }
  }

  disableDefaultSchemaExtensions() {
    this.options.disableDefaultSchemaExtensions = true;
    this.schemaExtensions = this.schemaExtensions.filter(
      (e) => e.name.startsWith('default-') === false,
    ) as TokensWalkerSchemaExtension[];
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

  getTokenByPath(path: string) {
    return this.tokens.get(path)?.raw ?? get(this.tokensObj, path);
  }

  derefTokenValue(tokenValue: unknown) {
    return this.derefTokenValueHelper(tokenValue);
  }

  private derefTokenValueHelper(tokenValue: unknown, visitedTokens: Set<unknown> = new Set()): unknown {
    if (!tokenValue) {
      return tokenValue;
    }

    if (isTokenAlias(tokenValue)) {
      if (visitedTokens.has(tokenValue)) {
        throw new Error(`Circular dependency detected for token alias ${tokenValue} - ${[...visitedTokens]}`);
      }
      visitedTokens.add(tokenValue);
      const tokenPath = normalizeTokenAlias(tokenValue);
      const token = this.getTokenByPath(tokenPath);
      if (!token) {
        throw new Error(`Token alias ${tokenValue} not found`);
      }
      return this.derefTokenValueHelper(token.$value, visitedTokens);
    }

    // for composite tokens, we need to dereference the values of the sub tokens
    if (isObject(tokenValue) && !Array.isArray(tokenValue)) {
      return Object.entries(tokenValue).reduce(
        (acc, [key, value]) => {
          acc[key] = this.derefTokenValueHelper(value, visitedTokens);
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
    this.tokens.clear();
    this.walkTokens(this.tokensObj, '', (token, path) => {
      this.tokens.set(path, this.createToken(token, path));
    });

    for (const token of this.tokens.values()) {
      if (token.hasSchemaExtensions()) {
        this.processTokenActions(token);
      }
    }
  }

  private createRawTokenFromAction(action: TokensWalkerAction, parent: WalkerDesignToken) {
    if (action.type === 'remove') {
      return undefined;
    }
    const { defaultMode, requiredModes } = this.getModes();
    return {
      $value: getModeRawValue(action.payload, defaultMode),
      $type: parent.type as TokenType,
      $description: parent.description,
      $extensions: requiredModes.reduce(
        (acc, mode) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          acc.mode[mode] = getModeRawValue(action.payload, mode);
          return acc;
        },
        {
          mode: {},
        },
      ),
    } as DesignToken;
  }
  private processTokenActions(token: WalkerDesignToken) {
    const actions = this.runTokenExtensions(token);
    for (const action of actions) {
      switch (action.type) {
        case 'add': {
          const raw = this.createRawTokenFromAction(action, token);
          const newToken = this.createToken(raw!, action.path);
          newToken.applyTokenAction(action);
          this.tokens.set(action.path, newToken);
          break;
        }

        case 'update': {
          const existingToken = this.tokens.get(action.path);
          if (existingToken) {
            existingToken.applyTokenAction(action);
          }
          break;
        }
        case 'remove':
          toArray(action.path).forEach((path) => {
            this.tokens.delete(path);
          });
          break;
      }
    }
  }

  hasSchemaExtensions(path: string, token: DesignToken) {
    return this.schemaExtensions.some((e) => isMatchingTokensFilter([path, token], e.filter));
  }

  buildTokenValueByMode(token: DesignToken, path: string, normalize: boolean = this.options.normalizeTokenValue) {
    const override = this.options.overrides[path];
    const { requiredModes, defaultMode } = this.getModes();
    const defaultValue = typeof override === 'function' ? override(defaultMode, token) : token.$value;
    const valueByMode: DesignTokenValueByMode = {
      [defaultMode]: normalize
        ? {
            normalized: this.normalizeTokenValue(defaultValue),
            raw: defaultValue,
          }
        : defaultValue,
    };
    if (hasModeExtension(token)) {
      for (const mode of requiredModes) {
        const modeValue =
          typeof override === 'function' ? override(mode, token) : token.$extensions.mode[mode] || defaultValue;
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

  private runTokenExtensions(token: WalkerDesignToken) {
    const extensions = this.schemaExtensions.filter((e) => isMatchingTokensFilter([token.path, token.raw], e.filter));
    if (extensions.length === 0) {
      return [];
    }
    const actions = [] as TokensWalkerAction[];
    for (const extension of extensions) {
      actions.push(...extension.run(token, this));
    }
    return actions;
  }

  private createToken(raw: DesignToken, path: string): WalkerDesignToken {
    return new WalkerDesignToken(path, raw, this);
  }

  private createRawToken(
    $value: unknown,
    $type: TokenType,
    $description: string,
    tokenLike: Partial<DesignToken>,
  ): DesignToken {
    return {
      $value,
      $type,
      $description,
      ...tokenLike,
    } as DesignToken;
  }

  private walkTokens(tokens: object, path = '', walker: Walker) {
    for (const [key, token] of Object.entries(tokens)) {
      const currentPath = path ? `${path}.${key}` : key;
      const parentDescription = (token as any).$description;
      if (isDesignTokenGroup(token)) {
        const groupType = token.$type;
        // Remove the $type key to avoid processing it as a child token
        const { $type, ...tokenWithoutType } = token;
        // Recursively normalize the tokens inside the group
        for (const [groupKey, groupToken] of Object.entries(tokenWithoutType)) {
          if (!isObject(groupToken)) {
            continue;
          }
          const constructedToken = this.createRawToken(groupToken.$value, groupType, parentDescription, groupToken);
          if (isDesignTokenLike(constructedToken)) {
            walker(constructedToken, `${currentPath}.${groupKey}`);
          } else {
            // If the group token doesn't have a $value, treat it as another group or single token
            this.walkTokens(
              {
                [groupKey]: constructedToken,
              },
              currentPath,
              walker,
            );
          }
        }
      } else if (isDesignToken(token)) {
        walker(this.createRawToken(token.$value, token.$type, parentDescription, token), currentPath);
      } else if (isObject(token)) {
        // If the token isn't recognized as a group or single token, recurse into it to check its children
        this.walkTokens(token, currentPath, walker);
      }
    }
  }
}
