import { INVALID_CHARACTERS_REGEX, MATH_OPERATOR_REGEX, NUMBERS_REGEX, OPERATOR_SUFFIX_REGEX } from './constants';

/**
 * Evaluates the given numeric `expression`.
 *
 * @returns Returns the result of evaluating the given numeric `expression`,
 * else `null` for an invalid expression.
 * @category Number
 */
export function evaluateNumericExpression(value: string): null | number {
  if (value === '' || NUMBERS_REGEX.test(value) === false || INVALID_CHARACTERS_REGEX.test(value) === true) {
    return null;
  }
  if (MATH_OPERATOR_REGEX.test(value) === true) {
    if (OPERATOR_SUFFIX_REGEX.test(value) === true) {
      // Drop the operator suffix
      return eval(value.substring(0, value.length - 1)); // eslint-disable-line no-eval
    }
    return eval(value); // eslint-disable-line no-eval
  }
  return parseFloat(value);
}
