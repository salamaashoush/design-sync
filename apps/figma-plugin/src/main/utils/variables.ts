import { TokenType } from '@design-sync/w3c-dtfm';

export function variableScopeToTokenType(scope: VariableScope): TokenType {
  switch (scope) {
    case 'GAP':
    case 'CORNER_RADIUS':
    case 'WIDTH_HEIGHT':
      return 'dimension';
    case 'STROKE_COLOR':
    case 'ALL_FILLS':
    case 'TEXT_FILL':
    case 'FRAME_FILL':
    case 'SHAPE_FILL':
      return 'color';
    default:
      return 'other';
  }
}

export function guessTokenTypeFromScopes(scopes: VariableScope[]): TokenType {
  const types = scopes.map(variableScopeToTokenType);
  return (types[0] as TokenType) || 'other';
}

export function designTokenTypeToVariableType(type: TokenType) {
  switch (type) {
    case 'number':
    case 'dimension':
    case 'fontWeight':
      return 'FLOAT';
    case 'color':
      return 'COLOR';
    default:
      return 'STRING';
  }
}

export const SUPPORTED_TOKEN_TYPES: TokenType[] = ['color', 'fontFamily', 'fontWeight', 'number', 'dimension'];
