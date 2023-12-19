import type { ColorInput } from 'tinycolor2';
import tinyColor from 'tinycolor2';
import { ColorTokenModifier } from './types';
export function parseColor(color: ColorInput) {
  return tinyColor(color);
}

export function lightenColor(color: ColorInput, amount: number) {
  return parseColor(color).lighten(amount);
}

export function darkenColor(color: ColorInput, amount: number) {
  return parseColor(color).darken(amount);
}

export function saturateColor(color: ColorInput, amount: number) {
  return parseColor(color).saturate(amount);
}

export function desaturateColor(color: ColorInput, amount: number) {
  return parseColor(color).desaturate(amount);
}

export function opacifyColor(color: ColorInput, amount: number) {
  return parseColor(color).setAlpha(amount);
}

export function hueRotateColor(color: ColorInput, amount: number) {
  return parseColor(color).spin(amount);
}

export function invertColor(color: ColorInput, amount: number) {
  return tinyColor.mix(parseColor(color), parseColor('#fff'), amount);
}

export function grayscaleColor(color: ColorInput) {
  return parseColor(color).greyscale();
}

export function sepiaColor(color: ColorInput, amount: number) {
  const g = grayscaleColor(color);
  return tinyColor.mix(g, parseColor('#fff'), amount);
}

export function contrastColor(color: ColorInput, amount: number) {
  return parseColor(color).darken(amount).lighten(amount);
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

export function applyColorModifier(color: ColorInput, modifier: ColorTokenModifier) {
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
      return grayscaleColor(c);
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

export function applyColorModifiers(color: ColorInput, modifiers?: ColorTokenModifier | ColorTokenModifier[]) {
  if (!modifiers) {
    return color;
  }

  if (!Array.isArray(modifiers)) {
    return applyColorModifier(color, modifiers);
  }

  return modifiers.reduce(applyColorModifier, color);
}

export function formatColor(color: ColorInput) {
  return parseColor(color).toHexString();
}
