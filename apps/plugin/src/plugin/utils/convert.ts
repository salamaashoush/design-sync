import { memoize } from '@design-sync/utils';
import tiny from 'tinycolor2';
import { isRGBA } from './is';

export const deserialzeColor = memoize((color: string, alpha = false): RGBA | RGB => {
  if (color.includes('gradient')) {
    console.warn('gradient color is not supported');
    return { r: 0, g: 0, b: 0, a: 0 };
  }
  const rgb = tiny(color).toRgb();
  if (alpha) {
    return {
      r: rgb.r / 255,
      g: rgb.g / 255,
      b: rgb.b / 255,
      a: rgb.a,
    };
  }

  return {
    r: rgb.r / 255,
    g: rgb.g / 255,
    b: rgb.b / 255,
  };
});

export const convertFontWeight = memoize((fontWeight: string) => {
  // check if the font weight is a number
  if (parseInt(fontWeight)) {
    const weight = parseInt(fontWeight);
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
  } else {
    return fontWeight;
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

export function numberToHex(value: number) {
  const hex = Math.round(value * 255).toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

export function serailzeColor(color: RGBA | RGB) {
  const { r, g, b } = color;
  if (isRGBA(color) && color.a !== 1) {
    return `rgba(${[r, g, b].map((n) => Math.round(n * 255)).join(', ')}, ${color.a.toFixed(4)})`;
  }
  const hex = [numberToHex(r), numberToHex(g), numberToHex(b)].join('');
  return `#${hex}`;
}

export function serializeLineHeight(lineHeight: LineHeight): string {
  if (lineHeight.unit === 'PERCENT') {
    return `${lineHeight.value}%`;
  }

  if (lineHeight.unit === 'AUTO') {
    return 'auto';
  }

  return `${lineHeight?.value}px`;
}

export function serializeLetterSpacing(letterSpacing: LetterSpacing): string {
  if (letterSpacing.unit === 'PERCENT') {
    return `${letterSpacing.value}%`;
  }

  return `${letterSpacing?.value}px`;
}

export function serializeFontWeight(fontWeight: string): string {
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
      return fontWeight;
  }
}
