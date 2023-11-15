import 'culori/css';
import {
  converter,
  filterBrightness,
  filterContrast,
  filterGrayscale,
  filterHueRotate,
  filterInvert,
  filterSaturate,
  filterSepia,
  formatHex,
  formatHex8,
  Rgb,
} from 'culori/fn';
import { TokenModifier } from './types';

const parseColor = converter('rgb');

export type RGBA = Omit<Rgb, 'mode'> & { a?: number };
export function parseColorToRgba(color: unknown): RGBA {
  if (typeof color === 'string') {
    const c = parseColor(color) as RGBA;
    if (!c) {
      throw new Error(`invalid color ${color}`);
    }
    c.a = c.alpha;
    return c;
  }
  (color as RGBA).a = (color as RGBA).alpha;
  return color as RGBA;
}

function getRgbColor(color: unknown): Rgb {
  return { ...parseColorToRgba(color), mode: 'rgb' };
}

export function lightenColor(color: RGBA | string, amount: number) {
  return filterBrightness(amount)(getRgbColor(color));
}

export function darkenColor(color: RGBA | string, amount: number) {
  return filterBrightness(-amount)(getRgbColor(color));
}

export function saturateColor(color: RGBA | string, amount: number) {
  return filterSaturate(amount)(getRgbColor(color));
}

export function desaturateColor(color: RGBA | string, amount: number) {
  return filterSaturate(-amount)(getRgbColor(color));
}

export function opacifyColor(color: RGBA | string, amount: number) {
  color = getRgbColor(color);
  const normalizedAmount = amount < 1 ? amount : Math.min(1, amount / 100);
  return normalizedAmount < 1
    ? { ...color, alpha: color.alpha ? color.alpha - normalizedAmount : normalizedAmount }
    : color;
}

export function contrastColor(color: RGBA | string, amount: number) {
  return filterContrast(amount)(getRgbColor(color));
}

export function hueRotateColor(color: RGBA | string, amount: number) {
  return filterHueRotate(amount)(getRgbColor(color));
}

export function invertColor(color: RGBA | string, amount: number) {
  return filterInvert(amount)(getRgbColor(color));
}

export function grayscaleColor(color: RGBA | string, amount: number) {
  return filterGrayscale(amount)(getRgbColor(color));
}

export function sepiaColor(color: RGBA | string, amount: number) {
  return filterSepia(amount)(getRgbColor(color));
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

export function applyColorModifier(color: RGBA | string, modifier: TokenModifier) {
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

export function applyColorModifiers(color: Rgb, modifiers?: TokenModifier | TokenModifier[]) {
  if (!modifiers) {
    return color;
  }

  if (!Array.isArray(modifiers)) {
    return applyColorModifier(color, modifiers);
  }

  return modifiers.reduce(applyColorModifier, color);
}

export function formatColor(color: unknown) {
  const c = getRgbColor(color);
  return typeof c.alpha === 'number' ? formatHex8(c) : formatHex(c);
}
