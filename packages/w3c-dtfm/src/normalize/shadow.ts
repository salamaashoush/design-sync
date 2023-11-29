import { isTokenAlias } from '../guards';
import { Color, Shadow } from '../types';
import { normalizeColorValue } from './color';
import { normalizeDimensionValue } from './dimension';

const keys = ['offsetX', 'offsetY', 'blur', 'spread', 'color'];
export function normalizeShadowValue(value: unknown) {
  if (isTokenAlias(value)) {
    return value;
  }

  if (!value || (typeof value !== 'object' && !Array.isArray(value))) {
    throw new Error(
      `${typeof value} is not a valid DTFM shadow value  (must be an object {offsetX, offsetY, blur, spread, color} or an array of objects, or a token alias )}`,
    );
  }

  const v = Array.isArray(value) ? value : [value];
  const shadows: Shadow[] = [];
  for (const [i, shadow] of v.entries()) {
    for (const k of keys) {
      const errorPrefix = v.length > 1 ? `shadow ${i + 1}:` : '';
      if (typeof shadow[k] === 'number' && shadow[k] > 0) {
        throw new Error(`${errorPrefix}${k} must be a string or 0`);
      }
      if (k === 'offsetX' || k === 'offsetY') {
        if (typeof shadow[k] !== 'string' && shadow[k] !== 0) {
          throw new Error(`${errorPrefix}${k} must be a string or 0`);
        }
      }
    }
    shadows.push({
      offsetX: normalizeDimensionValue(shadow.offsetX || '0'),
      offsetY: normalizeDimensionValue(shadow.offsetY || '0'),
      blur: normalizeDimensionValue(shadow.blur || '0'),
      spread: normalizeDimensionValue(shadow.spread || '0'),
      color: normalizeColorValue(shadow.color) as Color,
    });
  }
  return shadows;
}
