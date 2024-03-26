import type { TokenTypes } from './constants';

export type Number = number;
export type Color = `#${string}`;
export type CubicBezier = [number, number, number, number];
export type Duration = `${number}ms`;
export type Dimension = `${number}px` | `${number}rem`;
export type FontWeightName =
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
  | FontWeightName;
export type FontFamily = string | string[];

export interface StrokeStyleObject {
  lineCap: 'butt' | 'round' | 'square';
  dashArray: Dimension[];
}

export type StrokeStyleName = 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset';
export type StrokeStyle = StrokeStyleName | StrokeStyleObject;

export interface Shadow {
  color: Color | TokenAlias;
  offsetX: Dimension | TokenAlias;
  offsetY: Dimension | TokenAlias;
  blur: Dimension | TokenAlias;
  spread: Dimension | TokenAlias;
}

export interface Border {
  width: Dimension | TokenAlias;
  style: StrokeStyle | TokenAlias;
  color: Color | TokenAlias;
}

export interface Transition {
  duration: Duration | TokenAlias;
  delay: Duration | TokenAlias;
  timingFunction: CubicBezier | TokenAlias;
}

export interface GradientStop {
  color: Color | TokenAlias;
  position: number | TokenAlias;
}
export type Gradient = GradientStop[];

export interface Typography {
  fontFamily: FontFamily | TokenAlias;
  fontSize: Dimension | TokenAlias;
  fontWeight: FontWeight | TokenAlias;
  letterSpacing: Dimension | TokenAlias;
  lineHeight: number | TokenAlias;
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
  shadow: Shadow | Shadow[];
  border: Border;
  transition: Transition;
  gradient: Gradient;
  typography: Typography;
  link: string;
  other: unknown;
}
export type TokenType = (typeof TokenTypes)[keyof typeof TokenTypes];
export type TokenAlias = `{${string}}`;

export interface AdditionalLabelingMeta {
  $name?: string;
  $title?: string;
}
export interface TokenDefinition<T extends TokenType, V = Tokens[T]> extends AdditionalLabelingMeta {
  $value: V | TokenAlias;
  $type: T;
  $description?: string;
  $extensions?: Record<string, unknown>;
}

export type DerefToken<T extends TokenDefinition<TokenType>> = {
  [K in keyof T]: Exclude<T[K], TokenAlias>;
};

export type TokenGroupItemDefinition<T extends TokenType> = Omit<TokenDefinition<T>, '$type'>;
export interface TokenGroupDefinition<T extends TokenType> {
  $type: T;
  [key: string]: TokenGroupDefinition<T> | TokenGroupItemDefinition<T> | T | undefined;
}

export type DesignTokenDefinition<T extends TokenType> = TokenDefinition<T> | TokenGroupDefinition<T>;

export type TokenValue<T extends TokenType> = Tokens[T] | TokenAlias;

// a discriminated union of all token types
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

// a design token group is an object with $type required and a any other key is a memeber of the group
export interface DesignTokens {
  [key: string]: DesignToken | DesignTokens | undefined;
}

export type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
export type ReplaceTofK<T, K extends keyof T, V> = {
  [P in keyof T]: P extends K ? V : T[P];
};

export interface ModeExtension<T = DesignToken['$value']> {
  mode: Record<string, T>;
}

export interface ModesExtension {
  modes: {
    requiredModes: string[];
    defaultMode?: string;
  };
}

export type WithExtension<E, T extends DesignToken = DesignToken> = ReplaceTofK<
  RequiredKeys<T, '$extensions'>,
  '$extensions',
  E
>;

export type ColorModifier =
  | 'darken'
  | 'lighten'
  | 'saturate'
  | 'desaturate'
  | 'alpha'
  | 'contrast'
  | 'invert'
  | 'grayscale'
  | 'sepia'
  | 'hue-rotate';

export interface ColorTokenModifier {
  type: ColorModifier;
  value: string | number | Record<string, string | number>;
}
