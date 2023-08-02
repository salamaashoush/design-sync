import { DesignToken, TokenAlais, TokenDefinition } from './types';

export function isDesignToken(value: any): value is DesignToken {
  return typeof value === 'object' && value !== null && '$type' in value && '$value' in value;
}

export function isTokenAlias(value: any): value is TokenAlais {
  return typeof value === 'string' && value.match(/(\$[^\s,]+\w)|({([^}]*)})/g) !== null;
}

export function isColorToken(value: any): value is TokenDefinition<'color'> {
  return isDesignToken(value) && value.$type === 'color';
}

export function isCubicBezierToken(value: any): value is TokenDefinition<'cubicBezier'> {
  return isDesignToken(value) && value.$type === 'cubicBezier';
}

export function isFontFamilyToken(value: any): value is TokenDefinition<'fontFamily'> {
  return isDesignToken(value) && value.$type === 'fontFamily';
}

export function isFontWeightToken(value: any): value is TokenDefinition<'fontWeight'> {
  return isDesignToken(value) && value.$type === 'fontWeight';
}

export function isDimensionToken(value: any): value is TokenDefinition<'dimension'> {
  return isDesignToken(value) && value.$type === 'dimension';
}

export function isNumberToken(value: any): value is TokenDefinition<'number'> {
  return isDesignToken(value) && value.$type === 'number';
}

export function isDurationToken(value: any): value is TokenDefinition<'duration'> {
  return isDesignToken(value) && value.$type === 'duration';
}

export function isStrokeStyleToken(value: any): value is TokenDefinition<'strokeStyle'> {
  return isDesignToken(value) && value.$type === 'strokeStyle';
}

export function isShadowToken(value: any): value is TokenDefinition<'shadow'> {
  return isDesignToken(value) && value.$type === 'shadow';
}

export function isBorderToken(value: any): value is TokenDefinition<'border'> {
  return isDesignToken(value) && value.$type === 'border';
}

export function isTransitionToken(value: any): value is TokenDefinition<'transition'> {
  return isDesignToken(value) && value.$type === 'transition';
}

export function isGradientToken(value: any): value is TokenDefinition<'gradient'> {
  return isDesignToken(value) && value.$type === 'gradient';
}

export function isTypographyToken(value: any): value is TokenDefinition<'typography'> {
  return isDesignToken(value) && value.$type === 'typography';
}

export function isOtherToken(value: any): value is TokenDefinition<'other'> {
  return isDesignToken(value) && value.$type === 'other';
}
