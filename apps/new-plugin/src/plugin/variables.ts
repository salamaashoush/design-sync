import { TokenType } from '@tokenize/w3c-tokens';

export function varaibleScopeToTokenType(scope: VariableScope): TokenType {
  switch (scope) {
    case 'GAP':
    case 'CORNER_RADIUS':
    case 'WIDTH_HEIGHT':
      return 'dimension';
    case 'STROKE':
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
  const types = scopes.map(varaibleScopeToTokenType);
  return types[0] || 'other';
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
