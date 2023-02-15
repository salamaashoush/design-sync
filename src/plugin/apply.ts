import {
  Sides,
  SidesFor,
  SizingTokenOptions,
  SpacingTokenOptions,
  TokenTypes,
} from "../types";
import {
  getFigmaFontSize,
  getFigmaFontStyleFromWeight,
  getFigmaRGBColor,
  getFigmaTextCase,
  getFigmaTextDecoration,
  getFigmaValueWithUnit,
} from "./transform";

export function applyColorTokenToNode(
  token: TokenTypes["color"],
  node: Readonly<SceneNode[]>
) {
  const { value } = token;
  const nodes = Array.isArray(node) ? node : [node];
  const color = getFigmaRGBColor(value);
  nodes.forEach((node) => {
    if ("fills" in node) {
      node.fills = [
        {
          type: "SOLID",
          color: color,
        },
      ];
    }
  });
}

export function applyBorderTokenToNode(
  token: TokenTypes["border"],
  node: Readonly<SceneNode[]>
) {
  const {
    value: { width, color, style },
  } = token;
  const nodes = Array.isArray(node) ? node : [node];
  nodes.forEach((node) => {
    if ("strokes" in node) {
      node.strokes = [
        {
          type: "SOLID",
          color: getFigmaRGBColor(color),
        },
      ];
      node.strokeWeight = width;
      node.dashPattern = style === "dashed" ? [8, 8] : [];
    }
  });
}

const allLayoutSpacingProps = [
  "paddingTop",
  "paddingBottom",
  "paddingRight",
  "paddingLeft",
  "paddingHorizontal",
  "paddingVertical",
  "itemSpacing",
] as const;
export function applySpacingTokenToNode(
  token: TokenTypes["spacing"],
  node: Readonly<SceneNode[]>,
  { sides = "all" }: SpacingTokenOptions = {}
) {
  const { value } = token;
  const nodes = Array.isArray(node) ? node : [node];
  nodes.forEach((node) => {
    const propsToApply =
      sides === "all"
        ? allLayoutSpacingProps
        : sides === "gap"
        ? ["itemSpacing"]
        : Array.isArray(sides)
        ? sides
        : [sides];
    // apply auto layout spacing
    propsToApply.forEach((prop) => {
      if (prop in node) {
        node[prop] = value;
      }
    });
  });
}

export function applySizingTokenToNode(
  token: TokenTypes["sizing"],
  node: Readonly<SceneNode[]>,
  { dimension = "all" }: SizingTokenOptions = {}
) {
  const { value } = token;
  const nodes = Array.isArray(node) ? node : [node];
  nodes.forEach((node) => {
    node.resize(
      dimension === "all" || dimension === "width" ? value : node.width,
      dimension === "all" || dimension === "height" ? value : node.height
    );
  });
}

export function applyFontWeightTokenToNode(
  token: TokenTypes["fontWeight"],
  node: Readonly<SceneNode[]>
) {
  const { value } = token;
  const nodes = Array.isArray(node) ? node : [node];
  nodes.forEach((node) => {
    if ("fontName" in node) {
      node.fontName = {
        family: node.fontName.family,
        style: value,
      };
    }
  });
}

export function applyFontSizeTokenToNode(
  token: TokenTypes["fontSize"],
  node: Readonly<SceneNode[]>
) {
  const { value } = token;
  const nodes = Array.isArray(node) ? node : [node];
  nodes.forEach((node) => {
    if ("fontSize" in node) {
      node.fontSize = value;
    }
  });
}

export function applyLineHeightTokenToNode(
  token: TokenTypes["lineHeight"],
  node: Readonly<SceneNode[]>
) {
  const { value } = token;
  const nodes = Array.isArray(node) ? node : [node];
  nodes.forEach((node) => {
    if ("lineHeight" in node) {
      node.lineHeight = value;
    }
  });
}

export function applyBorderWidthTokenToNode(
  token: TokenTypes["borderWidth"],
  node: Readonly<SceneNode[]>
) {
  const { value } = token;
  const nodes = Array.isArray(node) ? node : [node];
  nodes.forEach((node) => {
    if ("strokeWeight" in node) {
      node.strokeWeight = value;
    }
  });
}

export function applyBorderRadiusTokenToNode(
  token: TokenTypes["borderRadius"],
  node: Readonly<SceneNode[]>
) {
  const { value } = token;
  const nodes = Array.isArray(node) ? node : [node];
  nodes.forEach((node) => {
    if ("cornerRadius" in node) {
      node.cornerRadius = value;
    }
  });
}

export function applyTextCaseTokenToNode(
  token: TokenTypes["textCase"],
  node: Readonly<SceneNode[]>
) {
  const { value } = token;
  const nodes = Array.isArray(node) ? node : [node];
  nodes.forEach((node) => {
    if ("textCase" in node) {
      node.textCase = value;
    }
  });
}

export function applyLetterSpacingTokenToNode(
  token: TokenTypes["letterSpacing"],
  node: Readonly<SceneNode[]>
) {
  const { value } = token;
  const nodes = Array.isArray(node) ? node : [node];
  nodes.forEach((node) => {
    if ("letterSpacing" in node) {
      node.letterSpacing = value;
    }
  });
}

export function applyTextDecorationTokenToNode(
  token: TokenTypes["textDecoration"],
  node: Readonly<SceneNode[]>
) {
  const { value } = token;
  const nodes = Array.isArray(node) ? node : [node];
  nodes.forEach((node) => {
    if ("textDecoration" in node) {
      node.textDecoration = value;
    }
  });
}

export async function applyTypographyTokenToNode(
  token: TokenTypes["typography"],
  node: Readonly<SceneNode[]>
) {
  const {
    value: {
      fontSize,
      fontWeight,
      lineHeight,
      fontFamily,
      color,
      letterSpacing,
      textDecoration,
      textCase,
    },
  } = token;
  const nodes = Array.isArray(node) ? node : [node];
  const fontStyle = getFigmaFontStyleFromWeight(fontWeight);
  // load font
  await figma.loadFontAsync({
    family: fontFamily,
    style: fontStyle,
  });

  nodes.forEach((node) => {
    if ("fontName" in node) {
      node.fontName = {
        family: fontFamily,
        style: fontStyle,
      };
    }
    if ("fontSize" in node) {
      node.fontSize = getFigmaFontSize(fontSize);
    }
    if ("lineHeight" in node) {
      // lineHeight is a percentage of fontSize
      node.lineHeight = getFigmaValueWithUnit(lineHeight, node.fontSize);
    }
    if ("letterSpacing" in node) {
      node.letterSpacing = getFigmaValueWithUnit(letterSpacing, node.fontSize);
    }
    if ("textDecoration" in node) {
      node.textDecoration = getFigmaTextDecoration(textDecoration);
    }
    if ("textCase" in node) {
      node.textCase = getFigmaTextCase(textCase);
    }
    if ("fills" in node) {
      node.fills = [
        {
          type: "SOLID",
          color: getFigmaRGBColor(color),
        },
      ];
    }
    // resize node to fit text
    if ("resize" in node) {
      node.resize(node.width, node.height);
    }
  });
}

export function appBoxShadowTokenToNode(
  token: TokenTypes["boxShadow"],
  node: Readonly<SceneNode[]>
) {
  const {
    value: { color, x, y, blur, spread },
  } = token;
  const nodes = Array.isArray(node) ? node : [node];
  nodes.forEach((node) => {
    if ("effects" in node) {
      node.effects = [
        {
          type: "DROP_SHADOW",
          color: getFigmaRGBColor(color, true),
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
  });
}
