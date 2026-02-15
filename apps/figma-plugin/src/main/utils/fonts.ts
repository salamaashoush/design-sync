import { memoize } from '@design-sync/utils';
import {
  DesignToken,
  Dimension,
  FontWeight,
  isFontFamilyToken,
  isFontWeightToken,
  isTypographyToken,
} from '@design-sync/w3c-dtfm';

export function isTextNode(node: SceneNode): node is TextNode {
  return node.type === 'TEXT';
}

export function isFontNeeded(token: DesignToken): boolean {
  return isFontWeightToken(token) || isFontFamilyToken(token) || isTypographyToken(token);
}

export const convertFontWeight = memoize((fontWeight: FontWeight) => {
  // check if the font weight is a number
  if (parseInt(fontWeight as string)) {
    const weight = parseInt(fontWeight as string);
    // convert it to figma font weight names
    switch (weight) {
      case 100:
        return 'Thin';
      case 200:
        return 'Extra Light';
      case 300:
        return 'Light';
      case 400:
        return 'Regular';
      case 500:
        return 'Medium';
      case 600:
        return 'Semi Bold';
      case 700:
        return 'Bold';
      case 800:
        return 'Extra Bold';
      case 900:
        return 'Black';
      default:
        return 'Regular';
    }
  }

  if (typeof fontWeight === 'string') {
    // replace - with space and capitalize all words
    return fontWeight.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }
});

export const convertFontSize = memoize((fontSize: string) => {
  const parsedFontSize = parseInt(fontSize);
  return parsedFontSize;
});

export const convertValue = memoize((value: string, relativeValue?: number) => {
  // check if the line height is a number with a unit
  const parsedValue = parseInt(value);
  if (value.includes('px')) {
    return {
      unit: 'PIXELS',
      value: parsedValue,
    };
  }

  if (value.includes('%')) {
    return {
      unit: 'PERCENT',
      value: parsedValue,
    };
  }

  // check if the line height is a number without a unit
  if (parsedValue && relativeValue) {
    return {
      unit: 'PERCENT',
      value: (parsedValue / relativeValue) * 100,
    };
  }

  return {
    unit: 'PIXELS',
    value: parsedValue,
  };
});

export const convertTextDecoration = memoize((textDecoration: string) => {
  // convert css text decoration to figma text decoration
  switch (textDecoration) {
    case 'underline':
      return 'UNDERLINE';
    case 'line-through':
      return 'STRIKETHROUGH';
    default:
      return 'NONE';
  }
});

export const convertTextCase = memoize((textCase: string) => {
  // convert css text transform to figma text case
  switch (textCase) {
    case 'uppercase':
      return 'UPPER';
    case 'lowercase':
      return 'LOWER';
    case 'capitalize':
      return 'TITLE';
    default:
      return 'ORIGINAL';
  }
});

export function serializeLineHeight(lineHeight: LineHeight, refValue = 16): number {
  if (lineHeight.unit === 'PERCENT') {
    return lineHeight.value / 100;
  }

  if (lineHeight.unit === 'AUTO') {
    return 1.2;
  }

  return lineHeight.value / refValue;
}

export function serializeLetterSpacing(letterSpacing: LetterSpacing): `${number}px` | `${number}rem` {
  if (letterSpacing.unit === 'PERCENT') {
    return `${letterSpacing.value}rem`;
  }

  return `${letterSpacing?.value}px`;
}

export function serializeFontWeight(fontWeight: string): FontWeight {
  switch (fontWeight) {
    case 'Thin':
      return '100';
    case 'Extra Light':
      return '200';
    case 'Light':
      return '300';
    case 'Regular':
      return '400';
    case 'Medium':
      return '500';
    case 'Semi Bold':
      return '600';
    case 'Bold':
      return '700';
    case 'Extra Bold':
      return '800';
    case 'Black':
      return '900';
    default:
      return fontWeight as FontWeight;
  }
}
