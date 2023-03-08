import { Token, Typography } from '../../types';
import { convertFontWeight } from './convert';
import { isFontFamilyToken, isFontWeightToken, isTypographyToken } from './is';

export function updateTokensForNode(node: SceneNode, path: string) {
  const currentTokens = node.getPluginData('tokens');
  if (currentTokens) {
    const parsedTokens = JSON.parse(currentTokens);
    if (!parsedTokens.includes(path)) {
      node.setPluginData('tokens', JSON.stringify([...parsedTokens, path]));
    }
  } else {
    node.setPluginData('tokens', JSON.stringify([path]));
  }
}

const loadedFonts = new Set<string>();

export async function loadFont(family: string, style = 'Regular') {
  if (!loadedFonts.has(family)) {
    await figma.loadFontAsync({ family, style });
    loadedFonts.add(`${family}-${style}`);
  }
}

export async function loadFontFromTokenOrNode(token: Token, node: TextNode) {
  let family, style;
  if (isFontWeightToken(token)) {
    style ??= convertFontWeight(token.value);
  }

  if (isFontFamilyToken(token)) {
    family ??= token.value;
  }

  if (isTypographyToken(token)) {
    const { fontFamily, fontWeight } = token.value as Typography;
    if (fontFamily) {
      family = fontFamily;
    }
    if (fontWeight) {
      style = convertFontWeight(fontWeight);
    }
  }
  // load from the token
  if (family || style) {
    await loadFont(family, style);
  }
  // load from the node
  family = (node.fontName as FontName).family;
  style = (node.fontName as FontName).style;
  await loadFont(family, style);
}
