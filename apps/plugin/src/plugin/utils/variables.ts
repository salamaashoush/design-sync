import { TokenType } from '../../types';

export function varaibleScopeToTokenType(scope: VariableScope): TokenType {
  switch (scope) {
    case 'CORNER_RADIUS':
      return 'borderRadius';
    case 'GAP':
      return 'spacing';
    case 'WIDTH_HEIGHT':
      return 'dimension';
    case 'STROKE':
    case 'TEXT_FILL':
    case 'FRAME_FILL':
    case 'SHAPE_FILL':
      return 'color';
    default:
      return 'other';
  }
}

export function guessTokenTypeFromScopes(scopes: VariableScope[]): TokenType {
  const types = scopes.map(varaibleScopeToTokenType);
  if (types.includes('color')) return 'color';
  if (types.includes('spacing')) return 'spacing';
  if (types.includes('borderRadius')) return 'borderRadius';
  if (types.includes('dimension')) return 'dimension';
  return 'other';
}

export function designTokenTypeToVariableType(type: TokenType) {
  switch (type) {
    case 'spacing':
    case 'sizing':
    case 'borderRadius':
    case 'dimension':
    case 'borderWidth':
    case 'opacity':
      return 'FLOAT';
    case 'color':
      return 'COLOR';
    default:
      return 'STRING';
  }
}

export const SUPPORTED_TOKEN_TYPES: TokenType[] = [
  'spacing',
  'sizing',
  'borderRadius',
  'dimension',
  // 'borderWidth',
  'opacity',
  'color',
  // 'fontSize',
  // 'fontWeight',
  // 'letterSpacing',
  // 'lineHeight',
];
