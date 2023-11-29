import { isTokenAlias } from '../guards';
import { Dimension } from '../types';

export const DIMENSION_REGEX = /^([0-9]+(\.[0-9]+)?)(px|rem)$/;

export function normalizeDimensionValue(value: unknown) {
  if (isTokenAlias(value)) {
    return value;
  }

  if (typeof value === 'number') {
    console.warn(
      "DTFM dimension value should be a string in the format '10px' or '10rem' or a token alias (got number) - coercing to pixels",
    );
    return `${value}px` as Dimension;
  }

  if (typeof value === 'string') {
    if (DIMENSION_REGEX.test(value)) {
      return value as Dimension;
    }
    if (parseFloat(value) === 0) {
      console.warn(
        "DTFM dimension value should be a string in the format '10px' or '10rem' or a token alias (got  '0') - coercing to pixels",
      );
      return '0px';
    }
  }

  throw new Error(
    `${value} is not a valid DTFM dimension value (must be a number or a px/rem value eg "10px" or "10rem" or a token alias)`,
  );
}

export function destructDimensionValue(value: Dimension) {
  const [, number, , unit] = DIMENSION_REGEX.exec(value)!;
  return { number: parseFloat(number), unit };
}
