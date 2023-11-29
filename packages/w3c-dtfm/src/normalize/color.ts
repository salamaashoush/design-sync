import { applyColorModifiers, formatColor, parseColor } from '../culori';
import { isTokenAlias } from '../guards';
import { ColorTokenModifier } from '../types';

export function normalizeColorValue(value: unknown, modifiers?: ColorTokenModifier | ColorTokenModifier[]) {
  if (isTokenAlias(value)) {
    return value;
  }

  if (typeof value === 'string') {
    // check if it is not a hex color
    if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) {
      console.warn(
        "DTFM color value should be a string in the format '#fff' or '#ffffff' or a token alias (got string) - parsing as CSS color string",
      );
    }
    const parsed = parseColor(value);
    const color = applyColorModifiers(parsed, modifiers);
    return formatColor(color);
  }

  throw new Error(
    `${value} is not a valid DTFM color value (must be a valid CSS color string eg "#fff", "rgba(0,0,0,0.5)", "white", etc or a token alias)`,
  );
}
