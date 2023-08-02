import { camelCase, set } from '@tokenize/utils';
import { Token } from '../../types';
import { serializeFontWeight, serializeLineHeight } from './convert';

export function textStylesToTypographyTokens() {
  const styles = figma.getLocalTextStyles();
  const tokens: Record<string, any> = {};
  for (const style of styles) {
    const { name, description, fontSize, letterSpacing, lineHeight, fontName } = style;
    const normalizedPath = `typography.${name.replace(/\//g, '.').split('.').map(camelCase).join('.')}`;
    const token: Token<'typography'> = {
      name,
      description,
      type: 'typography',
      value: {
        fontSize,
        letterSpacing,
        lineHeight: serializeLineHeight(lineHeight),
        fontFamily: fontName.family,
        fontWeight: serializeFontWeight(fontName.style),
      },
    };
    set(tokens, normalizedPath, token);
  }
  return tokens;
}
