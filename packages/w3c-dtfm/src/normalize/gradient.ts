import { isTokenAlias } from '../guards';
import { GradientStop } from '../types';
import { normalizeColorValue } from './color';

export function normalizeGradientValue(value: unknown) {
  if (!value) {
    throw new Error('missing value');
  }

  if (isTokenAlias(value)) {
    return value;
  }

  if (!Array.isArray(value)) {
    throw new Error(`expected array, received ${typeof value}`);
  }
  if (value.some((v) => !v || !v.color)) {
    throw new Error('all gradient stops must have color');
  }
  return value.map((v: GradientStop) => ({
    color: normalizeColorValue(v.color),
    position: typeof v.position === 'number' ? Math.max(0, Math.min(1, v.position)) : undefined,
  }));
}
