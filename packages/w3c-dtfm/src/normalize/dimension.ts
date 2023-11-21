import { isTokenAlias } from '../guards';
import { Dimension } from '../types';

export function normalizeDimensionValue(value: unknown) {
  if (isTokenAlias(value)) {
    return value;
  }
  if (typeof value === 'number') {
    return `${value}px` as Dimension;
  }
  if (typeof value === 'string') {
    if (parseFloat(value) === 0) {
      return '0';
    }
    return value as Dimension;
  }
  throw new Error(`expected string, received ${typeof value}`);
}
