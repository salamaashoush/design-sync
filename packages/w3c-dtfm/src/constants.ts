export const TokenTypes = {
  color: 'color',
  cubicBezier: 'cubicBezier',
  fontFamily: 'fontFamily',
  fontWeight: 'fontWeight',
  dimension: 'dimension',
  number: 'number',
  duration: 'duration',
  link: 'link',
  other: 'other',
  strokeStyle: 'strokeStyle',
  shadow: 'shadow',
  border: 'border',
  transition: 'transition',
  gradient: 'gradient',
  typography: 'typography',
} as const;

export const COMPOSITE_TYPES = ['gradient', 'shadow', 'border', 'transition', 'typography', 'strokeStyle'] as const;
export const SUPPORTED_TYPES = [
  ...COMPOSITE_TYPES,
  'color',
  'cubicBezier',
  'fontFamily',
  'fontWeight',
  'dimension',
  'number',
  'duration',
  'link',
  'other',
] as const;
// eslint-disable-next-line no-useless-escape
export const TOKEN_ALIAS_REGEX = /\{[^\.\{\}]+(\.[^\.\{\}]+)*\}/g;
// eslint-disable-next-line no-useless-escape
export const EXACT_TOKEN_ALIAS_REGEX = /^\{[^\.\{\}]+(\.[^\.\{\}]+)*\}$/g;
