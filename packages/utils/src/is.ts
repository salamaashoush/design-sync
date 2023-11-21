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

export const OBJECT_PATH_REGEX = /\b[a-zA-Z_]\w*(\.[a-zA-Z0-9_]\w+)+\b/g;
export function isObjectPath(value: unknown): value is string {
  OBJECT_PATH_REGEX.lastIndex = 0;
  return typeof value === 'string' && OBJECT_PATH_REGEX.test(value);
}

export const TEMPLATE_STRING_REGEX = /\${([^}]+)}/g;
export function hasTemplateString(value: unknown): value is string {
  TEMPLATE_STRING_REGEX.lastIndex = 0;
  return typeof value === 'string' && TEMPLATE_STRING_REGEX.test(value);
}

export function isValidJsObjectKey(key: string) {
  return /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(key);
}
