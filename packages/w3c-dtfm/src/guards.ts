import {
  DesignToken,
  ModeExtension,
  ModesExtension,
  RequiredKeys,
  TokenAlias,
  TokenDefinition,
  TokenGeneratorsExtension,
  TokenGroupDefinition,
  TokenModifiersExtension,
  TokenType,
  WithExtension,
} from './types';

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null;
}

export function isDesignToken(value: unknown): value is DesignToken {
  return isObject(value) && '$value' in value && '$type' in value;
}

export function isDesignTokenGroup(value: unknown): value is TokenGroupDefinition<TokenType> {
  return !isDesignToken(value) && isObject(value) && '$type' in value;
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

export function hasModifiersExtension(value: unknown): value is WithExtension<TokenModifiersExtension> {
  return hasTokenExtensions(value) && 'modifiers' in value.$extensions;
}

export function hasGeneratorsExtension(value: unknown): value is WithExtension<TokenGeneratorsExtension> {
  return hasTokenExtensions(value) && 'generators' in value.$extensions;
}

export function isCompositeToken(
  token: DesignToken,
): token is
  | TokenDefinition<'border'>
  | TokenDefinition<'shadow'>
  | TokenDefinition<'transition'>
  | TokenDefinition<'gradient'>
  | TokenDefinition<'typography'> {
  return ['border', 'shadow', 'transition', 'gradient', 'typography'].includes(token.$type);
}

export function isTokenAlias(value: unknown): value is TokenAlias {
  return typeof value === 'string' && value.match(/(\$[^\s,]+\w)|({([^}]*)})/g) !== null;
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
