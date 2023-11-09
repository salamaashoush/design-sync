import { isObject, isString, isTokenAlias } from '../guards';
import { StrokeStyleName } from '../types';

const VALID_STROKE_STYLES = new Set(['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'outset', 'inset']);

export function normalizeStrokeStyleValue(value: unknown) {
  if (isTokenAlias(value)) {
    return value;
  }
  if (isObject(value) || !isString(value) || !VALID_STROKE_STYLES.has(value)) {
    throw new Error(`Invalid stroke style: ${value}`);
  }
  return value as StrokeStyleName;
}
