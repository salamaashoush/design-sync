import { camelCase } from '@design-sync/utils';
import { normalizeTokenAlias } from './alias';
import { isTokenAlias } from './guards';
import { normalizeDimensionValue } from './normalize';
import { normalizeBorderValue } from './normalize/border';
import { normalizeColorValue } from './normalize/color';
import { normalizeGradientValue } from './normalize/gradient';
import { normalizeShadowValue } from './normalize/shadow';
import { normalizeStrokeStyleValue } from './normalize/stroke';
import { normalizeCubicBezierValue, normalizeDurationValue, normalizeTransitionValue } from './normalize/transition';
import { normalizeFontFamilyValue, normalizeFontWeightValue, normalizeTypographyValue } from './normalize/typography';
import { processPrimitiveValue } from './serialize';
import { DesignToken, TokenDefinition } from './types';

export function pathToStyleName(path: string, camel: boolean = true, count: number = 3) {
  const parts = (isTokenAlias(path) ? normalizeTokenAlias(path) : path).replace(/[^a-zA-Z0-9-_.]/g, '').split('.');
  const name = parts.slice(parts.length - count).join('-');
  return camel ? camelCase(name) : name;
}

export function pathToCssVarName(path: string, prefix?: string) {
  return `--${prefix ?? ''}${path.replace('@', '\\@').replace(/\./g, '-')}`;
}

export function processCssVarRef(tokenValue: string | number, prefix?: string, defaultValue?: string) {
  return processPrimitiveValue(tokenValue, (path) =>
    defaultValue ? `var(${pathToCssVarName(path, prefix)}, ${defaultValue})` : `var(${pathToCssVarName(path, prefix)})`,
  );
}

export function tokenPathToStyleName(path: string, textTransform = camelCase, count: number = 3) {
  const parts = (isTokenAlias(path) ? normalizeTokenAlias(path) : path).replace(/[^a-zA-Z0-9-_.]/g, '').split('.');
  const name = parts.slice(parts.length - count).join('-');
  return textTransform(name);
}

export function tokenValueToCssValue(tokenValue: unknown) {
  if (isTokenAlias(tokenValue)) {
    return normalizeTokenAlias(tokenValue);
  }
  return tokenValue;
}

export function colorToCssValue(color?: TokenDefinition<'color'>['$value']) {
  return normalizeColorValue(color);
}

export function borderToCssStyle(border?: TokenDefinition<'border'>['$value']) {
  const value = normalizeBorderValue(border);
  if (isTokenAlias(value)) {
    return value;
  }
  return {
    borderColor: value.color,
    borderWidth: value.width,
    borderStyle: value.style,
  };
}

export function borderToCssValue(border?: TokenDefinition<'border'>['$value']) {
  const value = borderToCssStyle(border);
  if (isTokenAlias(value)) {
    return value;
  }
  return `${value.borderWidth} ${value.borderStyle} ${value.borderColor}`;
}

export function shadowToCssValue(value?: TokenDefinition<'shadow'>['$value']) {
  const shadows = normalizeShadowValue(value);
  if (isTokenAlias(shadows)) {
    return shadows;
  }
  return shadows
    .map((shadow) => {
      return `${shadow.offsetX} ${shadow.offsetY} ${shadow.blur} ${shadow.spread} ${shadow.color}`;
    })
    .join(', ');
}

export function strokeStyleToCssValue(stroke?: TokenDefinition<'strokeStyle'>['$value']): string {
  return normalizeStrokeStyleValue(stroke);
}

export function cubicBezierToCssValue(c?: TokenDefinition<'cubicBezier'>['$value']) {
  const value = normalizeCubicBezierValue(c);
  if (isTokenAlias(value)) {
    return value;
  }
  return `cubic-bezier(${value.join(', ')})`;
}

export function transitionToCssStyle(transition?: TokenDefinition<'transition'>['$value']) {
  const value = normalizeTransitionValue(transition);
  if (isTokenAlias(value)) {
    return value;
  }
  return {
    transitionDuration: value.duration,
    transitionDelay: value.delay,
    transitionTimingFunction: cubicBezierToCssValue(value.timingFunction),
  };
}

export function transitionToCssValue(transition?: TokenDefinition<'transition'>['$value']) {
  const value = transitionToCssStyle(transition);
  if (isTokenAlias(value)) {
    return value;
  }
  return `${value.transitionDuration} ${value.transitionDelay} ${value.transitionTimingFunction}`;
}

export function fontFamilyToCssValue(fontFamily?: TokenDefinition<'fontFamily'>['$value']) {
  const value = normalizeFontFamilyValue(fontFamily);
  if (isTokenAlias(value)) {
    return value;
  }
  return Array.isArray(value) ? value.join(', ') : value;
}

export function fontWeightToCssValue(fontWeight?: TokenDefinition<'fontWeight'>['$value']) {
  const value = normalizeFontWeightValue(fontWeight);
  if (isTokenAlias(value)) {
    return value;
  }
  return value;
}

export function typographyToCssStyle(typography?: unknown) {
  const value = normalizeTypographyValue(typography);
  if (isTokenAlias(value)) {
    return value;
  }

  return {
    fontFamily: Array.isArray(value.fontFamily) ? value.fontFamily.join(', ') : value.fontFamily,
    fontSize: value.fontSize,
    fontWeight: value.fontWeight,
    lineHeight: value.lineHeight,
    letterSpacing: value.letterSpacing,
  };
}

export function typographyToCssValue(typography?: TokenDefinition<'typography'>['$value']) {
  const value = typographyToCssStyle(typography);
  if (isTokenAlias(value)) {
    return value;
  }
  return `${value.fontFamily} ${value.fontSize} ${value.fontWeight} ${value.lineHeight} ${value.letterSpacing}`;
}

export function gradientToCssValue(gradient?: TokenDefinition<'gradient'>['$value']) {
  const value = normalizeGradientValue(gradient);
  if (isTokenAlias(value)) {
    return value;
  }
  // convert the gradient stops to a css gradient
  return value.map((stop) => `${stop.color} ${stop.position ?? 0 * 100}%`).join(', ');
}

export function tokenValueToCss(tokenValue: DesignToken['$value'], type: DesignToken['$type']) {
  switch (type) {
    case 'color':
      return colorToCssValue(tokenValue as TokenDefinition<'color'>['$value']);
    case 'border':
      return borderToCssValue(tokenValue as TokenDefinition<'border'>['$value']);
    case 'shadow':
      return shadowToCssValue(tokenValue as TokenDefinition<'shadow'>['$value']);
    case 'strokeStyle':
      return strokeStyleToCssValue(tokenValue as TokenDefinition<'strokeStyle'>['$value']);
    case 'cubicBezier':
      return cubicBezierToCssValue(tokenValue as TokenDefinition<'cubicBezier'>['$value']);
    case 'transition':
      return transitionToCssValue(tokenValue as TokenDefinition<'transition'>['$value']);
    case 'fontFamily':
      return fontFamilyToCssValue(tokenValue as TokenDefinition<'fontFamily'>['$value']);
    case 'fontWeight':
      return fontWeightToCssValue(tokenValue as TokenDefinition<'fontWeight'>['$value']);
    case 'typography':
      return typographyToCssValue(tokenValue as TokenDefinition<'typography'>['$value']);
    case 'gradient':
      return gradientToCssValue(tokenValue as TokenDefinition<'gradient'>['$value']);
    case 'dimension':
      return normalizeDimensionValue(tokenValue as TokenDefinition<'dimension'>['$value']);
    case 'duration':
      return normalizeDurationValue(tokenValue as TokenDefinition<'duration'>['$value']);
    case 'link':
    case 'other':
    case 'number':
      return `${tokenValue}`;
    default:
      return '';
  }
}

export function tokenToCss(token: DesignToken) {
  return tokenValueToCss(token.$value, token.$type);
}
