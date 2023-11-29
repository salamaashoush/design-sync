import { isTokenAlias } from '../guards';
import { FontWeightName, Typography } from '../types';
import { normalizeDimensionValue } from './dimension';

export function normalizeFontFamilyValue(value: unknown): string | string[] {
  if (isTokenAlias(value)) {
    return value;
  }

  if (typeof value === 'string') {
    return [value];
  }

  if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
    return value;
  }

  throw new Error(`${typeof value} is not a valid DTFM font family value (must be a string or an array of strings)`);
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

  throw new Error(
    `${typeof value} is not a valid DTFM font weight value (must be a number or ${Object.keys(FONT_WEIGHT_ALIASES).join(
      ', ',
    )} or a token alias)`,
  );
}

export function normalizeTypographyValue(value: unknown) {
  if (isTokenAlias(value)) {
    return value;
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(
      `${typeof value} is not a valid DTFM typography value (must be an object { fontFamily, fontSize, lineHeight, letterSpacing, fontWeight } or a token alias)`,
    );
  }

  const entries = Object.entries(value);

  if (!entries.length) {
    throw new Error(
      'DTFM typography value must contain at least one property (fontFamily, fontSize, lineHeight, letterSpacing, fontWeight)',
    );
  }

  const normalized: Record<string, unknown> = {};
  for (const [k, v] of entries) {
    if (isTokenAlias(v)) {
      normalized[k] = v;
      continue;
    }
    switch (k) {
      case 'fontFamily': {
        normalized.fontFamily = normalizeFontFamilyValue(v);
        break;
      }
      case 'fontWeight': {
        normalized.fontWeight = normalizeFontWeightValue(v);
        break;
      }
      default: {
        normalized[k] = typeof v === 'string' && parseFloat(v) >= 0 ? normalizeDimensionValue(v) : v;
        break;
      }
    }
  }
  return normalized as unknown as Typography;
}
