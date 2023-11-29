import { isTokenAlias } from '../guards';
import { CubicBezier, Duration, TokenDefinition, Transition } from '../types';

export function normalizeCubicBezierValue(value: unknown) {
  if (isTokenAlias(value)) {
    return value;
  }

  if (!Array.isArray(value) || value.length !== 4 || value.some((v) => typeof v !== 'number')) {
    throw new Error(
      `${value} is not a valid DTFM cubicBezier value (must be an array array of 4 numbers [x1, y1, x2, y2] or a token alias)`,
    );
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
    console.warn(
      "DTFM duration value should be a string in the format '0.5s' or '500ms' or a token alias (got number) - coercing to milliseconds",
    );
    return `${value}ms`;
  }
  if (typeof value === 'string') {
    // allow '0', but throw on everything else
    if (parseFloat(value) === 0) {
      return '0ms';
    }
    if (DURATION_RE.test(value)) {
      return value as Duration;
    }
  }
  throw new Error(
    `${typeof value} is not a valid DTFM duration value (must be a number or a string in the format "0.5s" or "500ms" or a token alias)`,
  );
}

const EASE: TokenDefinition<'cubicBezier'>['$value'] = [0.25, 0.1, 0.25, 1];
export function normalizeTransitionValue(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(
      `${typeof value} is not a valid DTFM transition value (expected object {duration, timingFunction [, delay]} or token alias})`,
    );
  }

  if (isTokenAlias(value)) {
    return value;
  }

  if (!('duration' in value)) {
    throw new Error('duration is required in DTFM transition');
  }

  if (!('timingFunction' in value)) {
    throw new Error('timingFunction is required in DTFM transition');
  }

  const v = value as Transition;
  return {
    duration: normalizeDurationValue(v.duration || '0'),
    delay: normalizeDurationValue(v.delay || '0'),
    timingFunction: normalizeCubicBezierValue(v.timingFunction || EASE),
  };
}
