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

export const TOKEN_ALIAS_REGEX = /\{[\w@#-$]+(\.[\w@#-$]+)*\}/g;
export const EXACT_TOKEN_ALIAS_REGEX = /^\{[\w@#-$]+(\.[\w@#-$]+)*\}$/g;
