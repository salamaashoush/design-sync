import 'culori/css';
import {
  Color,
  filterBrightness,
  filterContrast,
  filterGrayscale,
  filterHueRotate,
  filterInvert,
  filterSaturate,
  filterSepia,
  formatHex,
  formatHex8,
  parse,
} from 'culori/fn';
import { TokenModifier } from './types';

export function parseColor(color: string | Color) {
  if (typeof color === 'string') {
    const c = parse(color);
    if (!c) {
      throw new Error(`invalid color ${color}`);
    }
    return c;
  }
  return color;
}

export function lightenColor(color: Color | string, amount: number) {
  return filterBrightness(amount)(parseColor(color));
}

export function darkenColor(color: Color | string, amount: number) {
  return filterBrightness(-amount)(parseColor(color));
}

export function saturateColor(color: Color | string, amount: number) {
  return filterSaturate(amount)(parseColor(color));
}

export function desaturateColor(color: Color | string, amount: number) {
  return filterSaturate(-amount)(parseColor(color));
}

export function opacifyColor(color: Color | string, amount: number) {
  color = parseColor(color);
  const normalizedAmount = amount < 1 ? amount : Math.min(1, amount / 100);
  return normalizedAmount < 1
    ? { ...color, alpha: color.alpha ? color.alpha - normalizedAmount : normalizedAmount }
    : color;
}

export function contrastColor(color: Color | string, amount: number) {
  return filterContrast(amount)(parseColor(color));
}

export function hueRotateColor(color: Color | string, amount: number) {
  return filterHueRotate(amount)(parseColor(color));
}

export function invertColor(color: Color | string, amount: number) {
  return filterInvert(amount)(parseColor(color));
}

export function grayscaleColor(color: Color | string, amount: number) {
  return filterGrayscale(amount)(parseColor(color));
}

export function sepiaColor(color: Color | string, amount: number) {
  return filterSepia(amount)(parseColor(color));
}

export function parseModifierValue(value: unknown) {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) {
      throw new Error(`invalid number value ${value}`);
    }
    return parsed;
  }
  if (typeof value === 'object' && value !== null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return parseModifierValue((value as any).value);
  }
  throw new Error(`invalid number value ${value}`);
}

export function applyColorModifier(color: Color | string, modifier: TokenModifier) {
  const c = parseColor(color);
  const value = parseModifierValue(modifier.value);
  switch (modifier.type) {
    case 'alpha':
      return opacifyColor(c, value);
    case 'contrast':
      return contrastColor(c, value);
    case 'darken':
      return darkenColor(c, value);
    case 'desaturate':
      return desaturateColor(c, value);
    case 'grayscale':
      return grayscaleColor(c, value);
    case 'hue-rotate':
      return hueRotateColor(c, value);
    case 'invert':
      return invertColor(c, value);
    case 'lighten':
      return lightenColor(c, value);
    case 'saturate':
      return saturateColor(c, value);
    case 'sepia':
      return sepiaColor(c, value);
    default:
      throw new Error(`invalid modifier type ${modifier.type}`);
  }
}

export function applyColorModifiers(color: Color | string, modifiers?: TokenModifier | TokenModifier[]) {
  if (!modifiers) {
    return color;
  }

  if (!Array.isArray(modifiers)) {
    return applyColorModifier(color, modifiers);
  }

  return modifiers.reduce(applyColorModifier, color);
}

export function formatColor(color: string | Color) {
  const c = parseColor(color);
  return typeof c.alpha === 'number' ? formatHex8(c) : formatHex(c);
}
