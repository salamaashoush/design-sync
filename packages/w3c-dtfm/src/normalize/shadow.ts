import { isTokenAlias } from '../guards';
import { Shadow } from '../types';
import { normalizeColorValue } from './color';
import { normalizeDimensionValue } from './dimension';

const keys = ['offsetX', 'offsetY', 'blur', 'spread', 'color'];
export function normalizeShadowValue(value: unknown) {
  if (!value) {
    throw new Error('missing value');
  }

  if (isTokenAlias(value)) {
    return value;
  }

  if (typeof value !== 'object' && !Array.isArray(value)) {
    throw new Error(`expected object or array of objects, got ${typeof value}`);
  }

  const v = Array.isArray(value) ? value : [value];
  const shadows: Shadow[] = [];
  for (const [i, shadow] of v.entries()) {
    for (const k of keys) {
      const errorPrefix = v.length > 1 ? `shadow #${i + 1}: ` : ''; // in error message, show shadow number, but only if there are multiple shadows
      if (typeof shadow[k] === 'number' && shadow[k] > 0) {
        throw new Error(`${errorPrefix}${k} missing units`);
      }
      if (k === 'offsetX' || k === 'offsetY') {
        if (typeof shadow[k] !== 'string' && shadow[k] !== 0) {
          throw new Error(`${errorPrefix}missing ${k}`);
        }
      }
    }
    shadows.push({
      offsetX: normalizeDimensionValue(shadow.offsetX || '0'),
      offsetY: normalizeDimensionValue(shadow.offsetY || '0'),
      blur: normalizeDimensionValue(shadow.blur || '0'),
      spread: normalizeDimensionValue(shadow.spread || '0'),
      color: normalizeColorValue(shadow.color),
    });
  }
  return shadows;
}
