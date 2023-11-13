import { isTokenAlias } from '../guards';
import { FontWeightName, Typography } from '../types';
import { normalizeDimensionValue } from './dimension';

export function normalizeFontFamilyValue(value: unknown): string | string[] {
  if (!value) {
    throw new Error('missing value');
  }

  if (isTokenAlias(value)) {
    return value;
  }

  if (typeof value === 'string') {
    return [value];
  }

  if (Array.isArray(value)) {
    if (value.every((v) => !!v && typeof v === 'string')) {
      return value;
    }
    throw new Error('expected array of strings');
  }
  throw new Error(`expected string or array of strings, received ${typeof value}`);
}

const FONT_WEIGHT_ALIASES: Record<FontWeightName, number> = {
  thin: 100,
  hairline: 100,
  'extra-light': 200,
  'ultra-light': 200,
  light: 300,
  normal: 400,
  regular: 400,
  book: 400,
  medium: 500,
  'semi-bold': 600,
  'demi-bold': 600,
  bold: 700,
  'extra-bold': 800,
  'ultra-bold': 800,
  black: 900,
  heavy: 900,
  'extra-black': 950,
  'ultra-black': 950,
};

export function normalizeFontWeightValue(value: unknown) {
  if (!value) {
    throw new Error('missing value');
  }

  if (isTokenAlias(value)) {
    return value;
  }

  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    // try to parse as number
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      return parsed;
    }
    // try to parse as font weight alias
    const normalized = value.toLowerCase().replace(/[^a-z0-9]/g, '') as FontWeightName;
    return FONT_WEIGHT_ALIASES[normalized as FontWeightName];
  }
  throw new Error(`expected number or font weight alias, received ${value} (${typeof value})`);
}

export function normalizeTypographyValue(value: unknown) {
  if (!value) {
    throw new Error('missing value');
  }
  if (isTokenAlias(value)) {
    return value;
  }

  if (typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`expected object, received ${Array.isArray(value) ? 'array' : typeof value}`);
  }

  if (!Object.keys(value).length) {
    throw new Error('must specify at least 1 font property');
  }

  const normalized = {} as Typography;
  for (const [k, v] of Object.entries(value)) {
    if (isTokenAlias(v)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (normalized as any)[k] = v;
      continue;
    }
    switch (k) {
      case 'fontName':
      case 'fontFamily': {
        normalized.fontFamily = normalizeFontFamilyValue(v);
        break;
      }
      case 'fontWeight': {
        normalized.fontWeight = normalizeFontWeightValue(v);
        break;
      }
      default: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (normalized as any)[k] = typeof v === 'string' && parseFloat(v) >= 0 ? normalizeDimensionValue(v) : v;
        break;
      }
    }
  }
  return normalized;
}
