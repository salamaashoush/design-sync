import { isObject, isTokenAlias } from '../guards';
import { normalizeColorValue } from './color';
import { normalizeDimensionValue } from './dimension';
import { normalizeStrokeStyleValue } from './stroke';

export function normalizeBorderValue(value?: unknown) {
  if (isTokenAlias(value)) {
    return value;
  }

  if (!isObject(value)) {
    throw new Error(`Expected object, received ${Array.isArray(value) ? 'array' : typeof value}`);
  }
  if (!('color' in value)) {
    throw new Error(`Token missing required "color" property`);
  }
  if (!('width' in value)) {
    throw new Error(`Token missing required "width" property`);
  }
  if (!('style' in value)) {
    throw new Error(`Token missing required "style" property`);
  }

  return {
    color: normalizeColorValue(value.color),
    width: normalizeDimensionValue(value.width),
    style: normalizeStrokeStyleValue(value.style),
  };
}