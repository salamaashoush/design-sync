import { FLOAT_NUMBER_REGEX, MATH_OPERATOR_REGEX } from './constants';

export function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null;
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumericString(value: string): boolean {
  const split = (value[0] === '-' ? value.substring(1) : value).split(MATH_OPERATOR_REGEX);
  let i = -1;
  while (++i < split.length) {
    const operand = split[i];
    if ((operand === '' && i !== split.length - 1) || FLOAT_NUMBER_REGEX.test(operand) === false) {
      return false;
    }
  }
  return true;
}

export function isValidJsObjectKey(key: string) {
  return /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(key);
}
