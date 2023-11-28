import { COMPOSITE_TYPES, EXACT_TOKEN_ALIAS_REGEX, TOKEN_ALIAS_REGEX } from './constants';
import {
  DesignToken,
  ModeExtension,
  ModesExtension,
  RequiredKeys,
  TokenAlias,
  TokenDefinition,
  TokenGroupDefinition,
  TokenType,
  WithExtension,
} from './types';

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null;
}

export function isDesignTokenGroup(value: unknown): value is TokenGroupDefinition<TokenType> {
  return isObject(value) && '$type' in value && !('$value' in value);
}

export function isDesignToken(value: unknown): value is DesignToken {
  return isObject(value) && '$value' in value && '$type' in value;
}

export function isDesignTokenLike(value: unknown): value is Omit<DesignToken, '$type'> {
  return isObject(value) && '$value' in value;
}

export function hasTokenExtensions(value: unknown): value is RequiredKeys<DesignToken, '$extensions'> {
  return isObject(value) && '$extensions' in value;
}

export function hasModeExtension(value: unknown): value is WithExtension<ModeExtension> {
  return hasTokenExtensions(value) && 'mode' in value.$extensions;
}

export function hasModesExtension(value: unknown): value is WithExtension<ModesExtension> {
  return hasTokenExtensions(value) && 'modes' in value.$extensions;
}

export function isCompositeToken(
  token: DesignToken,
): token is
  | TokenDefinition<'border'>
  | TokenDefinition<'shadow'>
  | TokenDefinition<'transition'>
  | TokenDefinition<'gradient'>
  | TokenDefinition<'typography'>
  | TokenDefinition<'strokeStyle'> {
  return (COMPOSITE_TYPES as unknown as TokenType[]).includes(token.$type);
}

export function hasTokenAlias(value: unknown): value is TokenAlias {
  TOKEN_ALIAS_REGEX.lastIndex = 0;
  return typeof value === 'string' && TOKEN_ALIAS_REGEX.test(value);
}

export function isTokenAlias(value: unknown): value is TokenAlias {
  EXACT_TOKEN_ALIAS_REGEX.lastIndex = 0;
  return typeof value === 'string' && EXACT_TOKEN_ALIAS_REGEX.test(value);
}

export function isColorToken(value: unknown): value is TokenDefinition<'color'> {
  return isDesignToken(value) && value.$type === 'color';
}

export function isCubicBezierToken(value: unknown): value is TokenDefinition<'cubicBezier'> {
  return isDesignToken(value) && value.$type === 'cubicBezier';
}

export function isFontFamilyToken(value: unknown): value is TokenDefinition<'fontFamily'> {
  return isDesignToken(value) && value.$type === 'fontFamily';
}

export function isFontWeightToken(value: unknown): value is TokenDefinition<'fontWeight'> {
  return isDesignToken(value) && value.$type === 'fontWeight';
}

export function isDimensionToken(value: unknown): value is TokenDefinition<'dimension'> {
  return isDesignToken(value) && value.$type === 'dimension';
}

export function isNumberToken(value: unknown): value is TokenDefinition<'number'> {
  return isDesignToken(value) && value.$type === 'number';
}

export function isDurationToken(value: unknown): value is TokenDefinition<'duration'> {
  return isDesignToken(value) && value.$type === 'duration';
}

export function isStrokeStyleToken(value: unknown): value is TokenDefinition<'strokeStyle'> {
  return isDesignToken(value) && value.$type === 'strokeStyle';
}

export function isShadowToken(value: unknown): value is TokenDefinition<'shadow'> {
  return isDesignToken(value) && value.$type === 'shadow';
}

export function isBorderToken(value: unknown): value is TokenDefinition<'border'> {
  return isDesignToken(value) && value.$type === 'border';
}

export function isTransitionToken(value: unknown): value is TokenDefinition<'transition'> {
  return isDesignToken(value) && value.$type === 'transition';
}

export function isGradientToken(value: unknown): value is TokenDefinition<'gradient'> {
  return isDesignToken(value) && value.$type === 'gradient';
}

export function isTypographyToken(value: unknown): value is TokenDefinition<'typography'> {
  return isDesignToken(value) && value.$type === 'typography';
}

export function isOtherToken(value: unknown): value is TokenDefinition<'other'> {
  return isDesignToken(value) && value.$type === 'other';
}
