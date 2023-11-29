import { isObject, isString, isTokenAlias } from '../guards';
import { StrokeStyleName } from '../types';

const VALID_STROKE_STYLES = ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'outset', 'inset'];

export function normalizeStrokeStyleValue(value: unknown) {
  if (isTokenAlias(value)) {
    return value;
  }

  if (isObject(value) || !isString(value) || !VALID_STROKE_STYLES.includes(value)) {
    throw new Error(
      `${value} is not a valid DTFM stroke style value (must be one of ${VALID_STROKE_STYLES.join(
        ', ',
      )} or a token alias)`,
    );
  }
  return value as StrokeStyleName;
}
