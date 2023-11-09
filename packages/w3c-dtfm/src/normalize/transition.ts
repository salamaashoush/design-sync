import { isTokenAlias } from '../guards';
import { CubicBezier, Duration, TokenDefinition, Transition } from '../types';

export function normalizeCubicBezierValue(value: unknown) {
  if (!value) {
    throw new Error('missing value');
  }

  if (isTokenAlias(value)) {
    return value;
  }

  if (!Array.isArray(value) || value.length !== 4 || value.some((v) => typeof v !== 'number')) {
    throw new Error(`expected [x1, y1, x2, y2], received ${JSON.stringify(value)}`);
  }

  return [
    Math.max(0, Math.min(1, value[0])), // x must be between 0–1
    value[1],
    Math.max(0, Math.min(1, value[2])), // x must be between 0–1
    value[3],
  ] as CubicBezier;
}

const DURATION_RE = /^\d+(\.\d+)?(ms|s)$/;
export function normalizeDurationValue(value: unknown) {
  if (isTokenAlias(value)) {
    return value;
  }

  // number not technically allowed, but coerce to milliseconds
  if (typeof value === 'number') {
    return `${value}ms`;
  }
  if (typeof value === 'string') {
    if (parseFloat(value) === 0) return '0ms'; // allow '0', but throw on everything else
    if (DURATION_RE.test(value)) {
      return value as Duration;
    }
    throw new Error(`invalid duration "${value}"`);
  }
  throw new Error(`expected string, received ${typeof value}`);
}

const EASE: TokenDefinition<'cubicBezier'>['$value'] = [0.25, 0.1, 0.25, 1];
export function normalizeTransitionValue(value: unknown) {
  if (!value) {
    throw new Error('missing value');
  }

  if (isTokenAlias(value)) {
    return value;
  }

  if (typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`expected object, got ${typeof value}`);
  }

  if (!('duration' in value)) {
    throw new Error('missing duration');
  }

  // currently delay is optional; is that right?
  if (!('timingFunction' in value)) {
    throw new Error('missing timingFunction');
  }

  const v = value as Transition;
  return {
    duration: normalizeDurationValue(v.duration || '0'),
    delay: normalizeDurationValue(v.delay || '0'),
    timingFunction: normalizeCubicBezierValue(v.timingFunction || EASE),
  };
}
