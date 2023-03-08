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
import { loadFontFromTokenOrNode } from './helper';
import {
  isBorderRadiusToken,
  isBorderToken,
  isBorderWidthToken,
  isBoxShadowToken,
  isColorToken,
  isCompositionToken,
  isFontNeeded,
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
    node.fills = [
      {
        type: 'SOLID',
        color: color,
      },
    ];
  }

  if (target === 'stroke' && 'strokes' in node) {
    node.strokes = [
      {
        type: 'SOLID',
        color,
      },
    ];
  }
}

export function applyBorderTokenToNode(value: TokenValue<'border'>, node: SceneNode) {
  const { width, color, style } = value;
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

interface FontToken {
  fontFamily?: TokenValue<'fontFamily'>;
  fontWeight?: TokenValue<'fontWeight'>;
}

export function applyFontTokensToNode({ fontWeight, fontFamily }: FontToken, node: SceneNode) {
  if (isTextNode(node)) {
    const fontName = node.fontName as FontName;
    const style = fontWeight ? convertFontWeight(fontWeight) : fontName.style;
    const family = fontFamily ?? fontName.family;

    if (family === fontName.family && style === fontName.style) {
      return;
    }

    node.fontName = {
      family,
      style,
    };
  }
}

export function applyFontSizeTokenToNode(value: TokenValue<'fontSize'>, node: SceneNode) {
  if (isTextNode(node)) {
    const newValue = convertFontSize(value);
    if (newValue === node.fontSize) {
      return;
    }
    node.fontSize = newValue;
  }
}

export function applyLineHeightTokenToNode(value: TokenTypes['lineHeight']['value'], node: SceneNode) {
  if (isTextNode(node)) {
    const newValue = convertValue(value, node.fontSize as number) as LineHeight;

    if (newValue === node.lineHeight) {
      return;
    }
    node.lineHeight = newValue;
  }
}

export function applyTextCaseTokenToNode(value: TokenTypes['textCase']['value'], node: SceneNode) {
  if (isTextNode(node)) {
    const newValue = convertTextCase(value);

    if (newValue === node.textCase) {
      return;
    }
    node.textCase = newValue;
  }
}

export function applyLetterSpacingTokenToNode(value: TokenValue<'letterSpacing'>, node: SceneNode) {
  if (isTextNode(node)) {
    const newValue = convertValue(value, node.fontSize as number) as LetterSpacing;

    if (newValue === node.letterSpacing) {
      return;
    }
    node.letterSpacing = newValue;
  }
}

export function applyTextDecorationTokenToNode(value: TokenValue<'textDecoration'>, node: SceneNode) {
  if (isTextNode(node)) {
    const newValue = convertTextDecoration(value);

    if (newValue === node.textDecoration) {
      return;
    }
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

export function applyTypographyTokenToNode(value: TokenValue<'typography'>, node: SceneNode) {
  const { fontSize, fontWeight, lineHeight, fontFamily, letterSpacing, textDecoration, textCase } = value;

  if (fontSize) {
    applyFontSizeTokenToNode(fontSize, node);
  }

  if (fontWeight || fontFamily) {
    applyFontTokensToNode({ fontWeight, fontFamily }, node);
  }

  if (lineHeight) {
    applyLineHeightTokenToNode(lineHeight, node);
  }

  if (letterSpacing) {
    applyLetterSpacingTokenToNode(letterSpacing, node);
  }

  if (textDecoration) {
    applyTextDecorationTokenToNode(textDecoration, node);
  }

  if (textCase) {
    applyTextCaseTokenToNode(textCase, node);
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
  console.log(nodes.length);
  const start = Date.now();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolvedValue: any = tokensService.resolveTokenValue<Token>(token.value);
  // check if we need to load fonts
  if (isFontNeeded(token)) {
    token.value = resolvedValue;
    await loadFontFromTokenOrNode(token, nodes[0]);
  }
  for (const node of nodes) {
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
      applyFontTokensToNode({ fontWeight: resolvedValue }, node);
    }

    if (isFontSizeToken(token)) {
      applyFontSizeTokenToNode(resolvedValue, node);
    }

    if (isLineHeightToken(token)) {
      applyLineHeightTokenToNode(resolvedValue, node);
    }

    if (isBorderWidthToken(token)) {
      applyBorderWidthTokenToNode(resolvedValue, node);
    }

    if (isBorderRadiusToken(token)) {
      applyBorderRadiusTokenToNode(resolvedValue, node);
    }

    if (isTextCaseToken(token)) {
      applyTextCaseTokenToNode(resolvedValue, node);
    }

    if (isLetterSpacingToken(token)) {
      applyLetterSpacingTokenToNode(resolvedValue, node);
    }

    if (isTextDecorationToken(token)) {
      applyTextDecorationTokenToNode(resolvedValue, node);
    }

    if (isTypographyToken(token)) {
      applyTypographyTokenToNode(resolvedValue, node);
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
  console.log('applyTokenToNodes', Date.now() - start);
}
