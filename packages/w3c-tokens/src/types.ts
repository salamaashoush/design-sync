export type Number = number;
export type Color = `#${string}`;
export type CubicBezier = [number, number, number, number];
export type Duration = `${number}ms`;
export type Dimension = `${number}px` | `${number}rem` | `${number}%` | 'auto';
export type FontWeightString =
  | 'thin'
  | 'hairline'
  | 'extra-light'
  | 'ultra-light'
  | 'light'
  | 'normal'
  | 'regular'
  | 'book'
  | 'medium'
  | 'semi-bold'
  | 'demi-bold'
  | 'bold'
  | 'extra-bold'
  | 'ultra-bold'
  | 'black'
  | 'heavy'
  | 'extra-black'
  | 'ultra-black';
export type FontWeight =
  | number
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | '950'
  | FontWeightString;
export type FontFamily = string | string[];

export interface StrokeStyleObject {
  lineCap: 'butt' | 'round' | 'square';
  dashArray: Dimension[];
}
export type StrokeStyle =
  | 'solid'
  | 'dashed'
  | 'dotted'
  | 'double'
  | 'groove'
  | 'ridge'
  | 'inset'
  | 'outset'
  | StrokeStyleObject;

export interface Shadow {
  color: Color;
  offsetX: Dimension;
  offsetY: Dimension;
  blur: Dimension;
  spread: Dimension;
}

export interface Border {
  width: Dimension;
  style: StrokeStyle;
  color: Color;
}

export interface Transition {
  duration: Duration;
  delay: Duration;
  timingFunction: CubicBezier;
}

export interface GradientStop {
  color: Color;
  position: number;
}
export type Gradient = GradientStop[];

export interface Typography {
  fontFamily: FontFamily;
  fontSize: Dimension;
  fontWeight: FontWeight;
  letterSpacing: Dimension;
  lineHeight: number;
}

/**
 * A design token definition. follows the W3C design tokens format https://tr.designtokens.org/format/#design-token
 */

export interface Tokens {
  color: Color;
  cubicBezier: CubicBezier;
  fontFamily: FontFamily;
  fontWeight: FontWeight;
  dimension: Dimension;
  number: number;
  duration: Duration;
  strokeStyle: StrokeStyle;
  shadow: Shadow;
  border: Border;
  transition: Transition;
  gradient: Gradient;
  typography: Typography;
  link: string;
  other: unknown;
}
export type TokenType = keyof Tokens;
export type TokenAlais = `{${string}}` | `$${string}`;
export interface TokenDefinition<T extends TokenType, V = Tokens[T]> {
  $value: V | TokenAlais;
  $type: T;
  $description?: string;
  $extensions?: Record<string, unknown>;
}

export type TokenValue<T extends TokenType> = Tokens[T];

// a descriminated union of all token types
export type DesignToken =
  | TokenDefinition<'color'>
  | TokenDefinition<'cubicBezier'>
  | TokenDefinition<'fontFamily'>
  | TokenDefinition<'fontWeight'>
  | TokenDefinition<'dimension'>
  | TokenDefinition<'number'>
  | TokenDefinition<'duration'>
  | TokenDefinition<'strokeStyle'>
  | TokenDefinition<'shadow'>
  | TokenDefinition<'border'>
  | TokenDefinition<'transition'>
  | TokenDefinition<'gradient'>
  | TokenDefinition<'typography'>
  | TokenDefinition<'link'>
  | TokenDefinition<'other'>;

export interface DesignTokensGroup {
  [key: string]: DesignToken | DesignTokensGroup | undefined;
}
