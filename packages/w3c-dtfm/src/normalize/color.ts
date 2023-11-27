import { applyColorModifiers, formatColor, parseColor } from '../culori';
import { isTokenAlias } from '../guards';
import { ColorTokenModifier } from '../types';

export function normalizeColorValue(value: unknown, modifiers?: ColorTokenModifier | ColorTokenModifier[]) {
  if (isTokenAlias(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = parseColor(value);
    const color = applyColorModifiers(parsed, modifiers);
    return formatColor(color);
  }
  throw new Error(`normalizeColorValue: expected string, received ${typeof value}, ${JSON.stringify(value)}`);
}
