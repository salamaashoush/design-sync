import {
  SizingTokenOptions,
  SpacingTokenOptions,
  TokenTypes,
  TokenValue,
} from "../../types";
import {
  convertColor,
  convertFontSize,
  convertFontWeight,
  convertTextCase,
  convertTextDecoration,
  convertValue,
} from "./convert";
import { isTextNode } from "./is";

export function applyColorTokenToNode(
  value: TokenValue<"color">,
  node: SceneNode,
  target: "fill" | "stroke" = "fill"
) {
  const color = convertColor(value);
  if (target === "fill" && "fills" in node) {
    node.fills = [
      {
        type: "SOLID",
        color: color,
      },
    ];
  }

  if (target === "stroke" && "strokes" in node) {
    for (const stroke of node.strokes) {
      stroke.type = "SOLID";
      stroke.color = color;
    }
  }
}

export function applyBorderTokenToNode(
  value: TokenValue<"border">,
  node: SceneNode
) {
  const { width, color, style } = value;
  console.log("applyBorderTokenToNode", value);
  if ("strokes" in node) {
    node.strokes = [
      {
        type: "SOLID",
        color: convertColor(color),
      },
    ];
    node.strokeWeight = width as number;
    node.dashPattern = style === "dashed" ? [8, 8] : [];
  }
}

const allLayoutSpacingProps = [
  "paddingTop",
  "paddingBottom",
  "paddingRight",
  "paddingLeft",
  "horizontalPadding",
  "verticalPadding",
  "itemSpacing",
] as const;

export function applySpacingTokenToNode(
  value: TokenValue<"spacing">,
  node: SceneNode,
  { sides = "all" }: SpacingTokenOptions = {}
) {
  const propsToApply = (
    sides === "all"
      ? allLayoutSpacingProps
      : sides === "gap"
      ? ["itemSpacing"]
      : Array.isArray(sides)
      ? sides
      : [sides]
  ) as typeof allLayoutSpacingProps;

  if ("paddingTop" in node) {
    for (const prop of propsToApply) {
      node[prop] = value;
    }
  }
}

export function applySizingTokenToNode(
  value: TokenValue<"sizing">,
  node: SceneNode,
  { dimension = "all" }: SizingTokenOptions = {}
) {
  if ("resize" in node) {
    node.resize(
      dimension === "all" || dimension === "width" ? value : node.width,
      dimension === "all" || dimension === "height" ? value : node.height
    );
  }
}

const loadedFonts = new Set<string>();
interface FontToken {
  fontFamily?: TokenValue<"fontFamily">;
  fontWeight?: TokenValue<"fontWeight">;
}
export async function applyFontTokensToNode(
  { fontWeight, fontFamily }: FontToken,
  node: SceneNode
) {
  if (isTextNode(node)) {
    const style = fontWeight
      ? convertFontWeight(fontWeight)
      : (node.fontName as FontName).style;

    const family = fontFamily ?? (node.fontName as FontName).family;
    if (!loadedFonts.has(family)) {
      await figma.loadFontAsync({
        family,
        style,
      });
      loadedFonts.add(family);
    }
    node.fontName = {
      family,
      style,
    };
  }
}

export function applyFontSizeTokenToNode(
  value: TokenValue<"fontSize">,
  node: SceneNode
) {
  if (isTextNode(node)) {
    node.fontSize = convertFontSize(value);
  }
}

export function applyLineHeightTokenToNode(
  value: TokenTypes["lineHeight"]["value"],
  node: SceneNode
) {
  if (isTextNode(node)) {
    node.lineHeight = convertValue(
      value,
      node.fontSize as number
    ) as LineHeight;
  }
}

export function applyTextCaseTokenToNode(
  value: TokenTypes["textCase"]["value"],
  node: SceneNode
) {
  if (isTextNode(node)) {
    node.textCase = convertTextCase(value);
  }
}

export function applyLetterSpacingTokenToNode(
  value: TokenValue<"letterSpacing">,
  node: SceneNode
) {
  if (isTextNode(node)) {
    node.letterSpacing = convertValue(
      value,
      node.fontSize as number
    ) as LetterSpacing;
  }
}

export function applyTextDecorationTokenToNode(
  value: TokenValue<"textDecoration">,
  node: SceneNode
) {
  if (isTextNode(node)) {
    node.textDecoration = convertTextDecoration(value);
  }
}

export function applyBorderWidthTokenToNode(
  value: TokenTypes["borderWidth"]["value"],
  node: SceneNode
) {
  if ("strokeWeight" in node) {
    node.strokeWeight = value;
  }
}

export function applyBorderRadiusTokenToNode(
  value: TokenValue<"borderRadius">,
  node: SceneNode
) {
  if ("cornerRadius" in node) {
    node.cornerRadius = value;
  }
}

export async function applyTypographyTokenToNode(
  value: TokenValue<"typography">,
  node: SceneNode
) {
  const {
    fontSize,
    fontWeight,
    lineHeight,
    fontFamily,
    letterSpacing,
    textDecoration,
    textCase,
  } = value;

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

export function appBoxShadowTokenToNode(
  value: TokenValue<"boxShadow">,
  node: SceneNode
) {
  const { color, x, y, blur, spread } = value;

  if ("effects" in node) {
    node.effects = [
      {
        type: "DROP_SHADOW",
        color: convertColor(color, true) as RGBA,
        offset: {
          x,
          y,
        },
        radius: spread,
        blendMode: "NORMAL",
        visible: true,
      },
    ];
  }
}

export function applyOpacityTokenToNode(
  value: TokenValue<"opacity">,
  node: SceneNode
) {
  if ("opacity" in node) {
    node.opacity = value;
  }
}

export function applyLayerTokenToNode(
  value: TokenValue<"layer">,
  node: SceneNode
) {
  // set layer order
  if ("parent" in node && "children" in node.parent) {
    const { parent } = node;
    const { children } = parent;
    const index = children.findIndex((child) => child.id === node.id);
    if (index !== -1) {
      children.splice(index, 1);
    }
    children.splice(value, 0, node);
  }
}

export function applyCompositionTokenToNode(
  value: TokenValue<"composition">,
  node: SceneNode
) {
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
    console.log("typography", value.typography);
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

export function applyComponentTokenToNode(
  value: TokenValue<"component">,
  node: ComponentNode
) {
  const { base, variants, compoundVariants, defaultVariants } = value;
  if (base) {
    applyCompositionTokenToNode(base, node);
  }

  console.log(node.variantProperties, node.componentPropertyDefinitions, node);
  // if (variants) {
  //   for (const [key, s] of Object.entries(variants)) {
  //   }
  // }
}
