import { SizingTokenOptions, SpacingTokenOptions, Token, TokenTypes, TokenValue } from '../../types';
import { tokensService } from '../tokensService';
import {
  convertColor,
  convertFontSize,
  convertFontWeight,
  convertTextCase,
  convertTextDecoration,
  convertValue,
} from './convert';
import {
  isBorderRadiusToken,
  isBorderToken,
  isBorderWidthToken,
  isBoxShadowToken,
  isColorToken,
  isCompositionToken,
  isFontSizeToken,
  isFontWeightToken,
  isLetterSpacingToken,
  isLineHeightToken,
  isSizingToken,
  isSpacingToken,
  isTextCaseToken,
  isTextDecorationToken,
  isTextNode,
  isTypographyToken,
} from './is';

export function applyColorTokenToNode(value: TokenValue<'color'>, node: SceneNode, target: 'fill' | 'stroke' = 'fill') {
  const color = convertColor(value);
  if (target === 'fill' && 'fills' in node) {
    if (Array.isArray(node.fills) && node.fills.length > 0) {
      node.fills = node.fills.map((fill) => ({
        ...fill,
        color,
      }));
    } else {
      node.fills = [
        {
          type: 'SOLID',
          color: color,
        },
      ];
    }
  }

  if (target === 'stroke' && 'strokes' in node) {
    if (Array.isArray(node.strokes) && node.strokes.length > 0) {
      node.strokes = node.strokes.map((stroke) => ({
        ...stroke,
        color,
      }));
    } else {
      node.strokes = [
        {
          type: 'SOLID',
          color,
        },
      ];
    }
  }
}

export function applyBorderTokenToNode(value: TokenValue<'border'>, node: SceneNode) {
  const { width, color, style } = value;
  console.log('applyBorderTokenToNode', value);
  if ('strokes' in node) {
    node.strokes = [
      {
        type: 'SOLID',
        color: convertColor(color),
      },
    ];
    node.strokeWeight = width as number;
    node.dashPattern = style === 'dashed' ? [8, 8] : [];
  }
}

const allLayoutSpacingProps = [
  'paddingTop',
  'paddingBottom',
  'paddingRight',
  'paddingLeft',
  'horizontalPadding',
  'verticalPadding',
  'itemSpacing',
] as const;

export function applySpacingTokenToNode(
  value: TokenValue<'spacing'>,
  node: SceneNode,
  { sides = 'all' }: SpacingTokenOptions = {},
) {
  const propsToApply = (
    sides === 'all' ? allLayoutSpacingProps : sides === 'gap' ? ['itemSpacing'] : Array.isArray(sides) ? sides : [sides]
  ) as typeof allLayoutSpacingProps;

  if ('paddingTop' in node) {
    for (const prop of propsToApply) {
      node[prop] = value;
    }
  }
}

export function applySizingTokenToNode(
  value: TokenValue<'sizing'>,
  node: SceneNode,
  { dimension = 'all' }: SizingTokenOptions = {},
) {
  if ('resize' in node) {
    node.resize(
      dimension === 'all' || dimension === 'width' ? value : node.width,
      dimension === 'all' || dimension === 'height' ? value : node.height,
    );
  }
}

const loadedFonts = new Set<string>();

async function loadFont(family: string, style = 'Regular') {
  if (!loadedFonts.has(family)) {
    await figma.loadFontAsync({ family, style });
    loadedFonts.add(`${family}-${style}`);
  }
}

async function loadFontsForNode(node: TextNode) {
  const { family, style } = node.fontName as FontName;
  await loadFont(family, style);
}

interface FontToken {
  fontFamily?: TokenValue<'fontFamily'>;
  fontWeight?: TokenValue<'fontWeight'>;
}

export async function applyFontTokensToNode({ fontWeight, fontFamily }: FontToken, node: SceneNode) {
  if (isTextNode(node)) {
    const fontName = node.fontName as FontName;
    const style = fontWeight ? convertFontWeight(fontWeight) : fontName.style;
    const family = fontFamily ?? fontName.family;

    if (family === fontName.family && style === fontName.style) {
      return;
    }

    await loadFont(family, style);
    node.fontName = {
      family,
      style,
    };
  }
}

export async function applyFontSizeTokenToNode(value: TokenValue<'fontSize'>, node: SceneNode) {
  if (isTextNode(node)) {
    const newValue = convertFontSize(value);
    if (newValue === node.fontSize) {
      return;
    }
    await loadFontsForNode(node);
    node.fontSize = newValue;
  }
}

export async function applyLineHeightTokenToNode(value: TokenTypes['lineHeight']['value'], node: SceneNode) {
  if (isTextNode(node)) {
    const newValue = convertValue(value, node.fontSize as number) as LineHeight;

    if (newValue === node.lineHeight) {
      return;
    }
    await loadFontsForNode(node);
    node.lineHeight = newValue;
  }
}

export async function applyTextCaseTokenToNode(value: TokenTypes['textCase']['value'], node: SceneNode) {
  if (isTextNode(node)) {
    const newValue = convertTextCase(value);

    if (newValue === node.textCase) {
      return;
    }
    await loadFontsForNode(node);
    node.textCase = newValue;
  }
}

export async function applyLetterSpacingTokenToNode(value: TokenValue<'letterSpacing'>, node: SceneNode) {
  if (isTextNode(node)) {
    const newValue = convertValue(value, node.fontSize as number) as LetterSpacing;

    if (newValue === node.letterSpacing) {
      return;
    }
    await loadFontsForNode(node);
    node.letterSpacing = newValue;
  }
}

export async function applyTextDecorationTokenToNode(value: TokenValue<'textDecoration'>, node: SceneNode) {
  if (isTextNode(node)) {
    const newValue = convertTextDecoration(value);

    if (newValue === node.textDecoration) {
      return;
    }
    await loadFontsForNode(node);
    node.textDecoration = newValue;
  }
}

export function applyBorderWidthTokenToNode(value: TokenTypes['borderWidth']['value'], node: SceneNode) {
  if ('strokeWeight' in node) {
    if (value === node.strokeWeight) {
      return;
    }
    node.strokeWeight = value;
  }
}

export function applyBorderRadiusTokenToNode(value: TokenValue<'borderRadius'>, node: SceneNode) {
  if ('cornerRadius' in node) {
    if (value === node.cornerRadius) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    node.cornerRadius = value;
  }
}

export async function applyTypographyTokenToNode(value: TokenValue<'typography'>, node: SceneNode) {
  const { fontSize, fontWeight, lineHeight, fontFamily, letterSpacing, textDecoration, textCase } = value;

  if (fontSize) {
    await applyFontSizeTokenToNode(fontSize, node);
  }

  if (fontWeight || fontFamily) {
    await applyFontTokensToNode({ fontWeight, fontFamily }, node);
  }

  if (lineHeight) {
    await applyLineHeightTokenToNode(lineHeight, node);
  }

  if (letterSpacing) {
    await applyLetterSpacingTokenToNode(letterSpacing, node);
  }

  if (textDecoration) {
    await applyTextDecorationTokenToNode(textDecoration, node);
  }

  if (textCase) {
    await applyTextCaseTokenToNode(textCase, node);
  }
}

export function appBoxShadowTokenToNode(value: TokenValue<'boxShadow'>, node: SceneNode) {
  const { color, offsetX, offsetY, radius, spread } = value;

  if ('effects' in node) {
    node.effects = [
      {
        type: 'DROP_SHADOW',
        color: convertColor(color, true) as RGBA,
        offset: {
          x: offsetX,
          y: offsetY,
        },
        radius,
        spread,
        blendMode: 'NORMAL',
        visible: true,
      },
    ];
  }
}

export function applyOpacityTokenToNode(value: TokenValue<'opacity'>, node: SceneNode) {
  if ('opacity' in node) {
    node.opacity = value;
  }
}

export function applyCompositionTokenToNode(value: TokenValue<'composition'>, node: SceneNode) {
  // applay border radius
  if (value.borderRadius) {
    applyBorderRadiusTokenToNode(value.borderRadius, node);
  }

  // apply border width
  if (value.borderWidth) {
    applyBorderWidthTokenToNode(value.borderWidth, node);
  }

  // apply border color
  if (value.borderColor) {
    applyColorTokenToNode(value.borderColor, node);
  }

  if (value.border) {
    applyBorderTokenToNode(value.border, node);
  }

  if (value.boxShadow) {
    appBoxShadowTokenToNode(value.boxShadow, node);
  }

  if (value.opacity) {
    applyOpacityTokenToNode(value.opacity, node);
  }

  // if (value.layer) {
  //   applyLayerTokenToNode(value.layer, node);
  // }

  if (value.typography) {
    applyTypographyTokenToNode(value.typography, node);
    console.log('typography', value.typography);
  }

  if (value.fill) {
    applyColorTokenToNode(value.fill, node);
  }

  if (value.spacing) {
    applySpacingTokenToNode(value.spacing, node);
  }

  if (value.sizing) {
    applySizingTokenToNode(value.sizing, node);
  }
}

// export function applyComponentTokenToNode(value: TokenValue<'component'>, node: ComponentNode) {
//   const { base, variants, compoundVariants, defaultVariants } = value;
//   if (base) {
//     applyCompositionTokenToNode(base, node);
//   }

//   console.log(node.variantProperties, node.componentPropertyDefinitions, node);
//   // if (variants) {
//   //   for (const [key, s] of Object.entries(variants)) {
//   //   }
//   // }
// }

export async function applyTokenToNodes(token: Token, path: string, nodes: readonly SceneNode[]) {
  for (const node of nodes) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resolvedValue: any = tokensService.resolveTokenValue<Token>(token.value);
    if (isColorToken(token)) {
      applyColorTokenToNode(resolvedValue, node);
    }
    if (isBorderToken(token)) {
      applyBorderTokenToNode(resolvedValue, node);
    }

    if (isSpacingToken(token)) {
      applySpacingTokenToNode(resolvedValue, node);
    }

    if (isSizingToken(token)) {
      applySizingTokenToNode(resolvedValue, node);
    }

    if (isFontWeightToken(token)) {
      await applyFontTokensToNode({ fontWeight: resolvedValue }, node);
    }

    if (isFontSizeToken(token)) {
      await applyFontSizeTokenToNode(resolvedValue, node);
    }

    if (isLineHeightToken(token)) {
      await applyLineHeightTokenToNode(resolvedValue, node);
    }

    if (isBorderWidthToken(token)) {
      applyBorderWidthTokenToNode(resolvedValue, node);
    }

    if (isBorderRadiusToken(token)) {
      applyBorderRadiusTokenToNode(resolvedValue, node);
    }

    if (isTextCaseToken(token)) {
      await applyTextCaseTokenToNode(resolvedValue, node);
    }

    if (isLetterSpacingToken(token)) {
      await applyLetterSpacingTokenToNode(resolvedValue, node);
    }

    if (isTextDecorationToken(token)) {
      await applyTextDecorationTokenToNode(resolvedValue, node);
    }

    if (isTypographyToken(token)) {
      await applyTypographyTokenToNode(resolvedValue, node);
    }

    if (isBoxShadowToken(token)) {
      appBoxShadowTokenToNode(resolvedValue, node);
    }

    // if (isComponentToken(token) && node.type === 'COMPONENT') {
    //   applyComponentTokenToNode(resolvedValue, node);
    // }

    if (isCompositionToken(token)) {
      applyCompositionTokenToNode(resolvedValue, node);
    }
    //store token path in node
    node.setPluginData(token.type, path);
  }
}
