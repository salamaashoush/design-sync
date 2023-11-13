import 'culori/css';
import {
  filterBrightness,
  filterContrast,
  filterGrayscale,
  filterHueRotate,
  filterInvert,
  filterSaturate,
  filterSepia,
  parse,
  type Color as CuloriColor,
} from 'culori/fn';
import { TokenModifier } from './types';

export function lightenColor(color: CuloriColor | string, amount: number) {
  if (typeof color === 'string') {
    color = parseColor(color);
  }
  return filterBrightness(amount)(color);
}

export function darkenColor(color: CuloriColor | string, amount: number) {
  if (typeof color === 'string') {
    color = parseColor(color);
  }
  return filterBrightness(-amount)(color);
}

export function saturateColor(color: CuloriColor | string, amount: number) {
  if (typeof color === 'string') {
    color = parseColor(color);
  }
  return filterSaturate(amount)(color);
}

export function desaturateColor(color: CuloriColor | string, amount: number) {
  if (typeof color === 'string') {
    color = parseColor(color);
  }
  return filterSaturate(-amount)(color);
}

export function opacifyColor(color: CuloriColor | string, amount: number) {
  if (typeof color === 'string') {
    color = parseColor(color);
  }
  const normalizedAmount = amount < 1 ? amount : Math.min(1, amount / 100);
  return normalizedAmount < 1
    ? { ...color, alpha: color.alpha ? color.alpha - normalizedAmount : normalizedAmount }
    : color;
}

export function contrastColor(color: CuloriColor | string, amount: number) {
  if (typeof color === 'string') {
    color = parseColor(color);
  }
  return filterContrast(amount)(color);
}

export function hueRotateColor(color: CuloriColor | string, amount: number) {
  if (typeof color === 'string') {
    color = parseColor(color);
  }
  return filterHueRotate(amount)(color);
}

export function invertColor(color: CuloriColor | string, amount: number) {
  if (typeof color === 'string') {
    color = parseColor(color);
  }
  return filterInvert(amount)(color);
}

export function grayscaleColor(color: CuloriColor | string, amount: number) {
  if (typeof color === 'string') {
    color = parseColor(color);
  }
  return filterGrayscale(amount)(color);
}

export function sepiaColor(color: CuloriColor | string, amount: number) {
  if (typeof color === 'string') {
    color = parseColor(color);
  }
  return filterSepia(amount)(color);
}

export function parseColor(color: string) {
  const parsed = parse(color);
  if (!parsed) {
    throw new Error(`invalid color value ${color}`);
  }
  return parsed;
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

export function applyColorModifier(color: CuloriColor | string, modifier: TokenModifier) {
  const value = parseModifierValue(modifier.value);
  switch (modifier.type) {
    case 'alpha':
      return opacifyColor(color, value);
    case 'contrast':
      return contrastColor(color, value);
    case 'darken':
      return darkenColor(color, value);
    case 'desaturate':
      return desaturateColor(color, value);
    case 'grayscale':
      return grayscaleColor(color, value);
    case 'hue-rotate':
      return hueRotateColor(color, value);
    case 'invert':
      return invertColor(color, value);
    case 'lighten':
      return lightenColor(color, value);
    case 'saturate':
      return saturateColor(color, value);
    case 'sepia':
      return sepiaColor(color, value);
    default:
      throw new Error(`invalid modifier type ${modifier.type}`);
  }
}

export function applyColorModifiers(color: CuloriColor, modifiers?: TokenModifier | TokenModifier[]) {
  if (!modifiers) {
    return color;
  }

  if (!Array.isArray(modifiers)) {
    return applyColorModifier(color, modifiers);
  }

  return modifiers.reduce(applyColorModifier, color);
}

export { formatHex, formatHex8, type Color as CuloriColor } from 'culori/fn';
