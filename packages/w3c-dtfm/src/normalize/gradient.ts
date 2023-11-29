import { isTokenAlias } from '../guards';
import { GradientStop } from '../types';
import { normalizeColorValue } from './color';

export function normalizeGradientValue(value: unknown) {
  if (isTokenAlias(value)) {
    return value;
  }

  if (!value || !Array.isArray(value)) {
    throw new Error(
      `${typeof value} is not a valid DTFM gradient value (must be an array of object {color, position} or a token alias)`,
    );
  }

  if (value.some((v) => !v || !v.color)) {
    throw new Error('DTFM gradient stops must be color values');
  }
  return value.map((v: GradientStop) => ({
    color: normalizeColorValue(v.color),
    position: typeof v.position === 'number' ? Math.max(0, Math.min(1, v.position)) : undefined,
  }));
}
