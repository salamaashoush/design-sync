import { applyColorModifiers, formatHex, formatHex8, parseColor } from '../culori';
import { isTokenAlias } from '../guards';
import { Color, TokenModifier } from '../types';

export function normalizeColorValue(value: unknown, modifiers?: TokenModifier | TokenModifier[]) {
  if (isTokenAlias(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = parseColor(value);
    const color = applyColorModifiers(parsed, modifiers);
    return (typeof color.alpha === 'number' && color.alpha < 1 ? formatHex8(color) : formatHex(color)) as Color;
  }
  throw new Error(`normalizeColorValue: expected string, received ${typeof value}`);
}
