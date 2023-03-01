export type Ref<T extends string> = `$${T}` | `{${T}}`;
export type UnRef<T extends Ref<string>> = T extends `$${infer R}` ? R : T extends `{${infer R}}` ? R : T;
export type RefOrValue<T> = T | Ref<string>;

export type Side = 'top' | 'right' | 'bottom' | 'left';
export type Direction = 'horizontal' | 'vertical';
export type Dimension = 'width' | 'height';
export type Sides = Side | Side[] | 'all';
export type SidesFor<T extends string> = `${T}${Capitalize<Side>}`;
export type DirectionFor<T extends string> = `${Direction}${Capitalize<T>}`;

export type SizingTarget = SidesFor<'padding'> | DirectionFor<'padding'> | 'all' | 'gap';
export interface SpacingTokenOptions {
  sides?: SizingTarget | SizingTarget[];
}

export interface SizingTokenOptions {
  dimension?: Dimension | 'all';
}

export interface BoxShadow {
  offsetX: number;
  offsetY: number;
  radius: number;
  spread: number;
  color: string;
}
export interface Border {
  width: RefOrValue<number>;
  style: RefOrValue<string>;
  color: RefOrValue<string>;
}
export interface Dimensions {
  width: RefOrValue<number>;
  height: RefOrValue<number>;
}
export interface Typography {
  fontFamily?: RefOrValue<string>;
  fontWeight?: RefOrValue<string>;
  fontSize?: RefOrValue<string>;
  lineHeight?: RefOrValue<string>;
  letterSpacing?: RefOrValue<string>;
  textDecoration?: RefOrValue<string>;
  textCase?: RefOrValue<string>;
}
export type StringToBoolean<T> = T extends 'true' | 'false' ? boolean : T;

type ComponentSchema = Record<string, Record<string, Partial<Composition>>>;
type ConfigVariants<T extends ComponentSchema> = {
  [Variant in keyof T]?: StringToBoolean<keyof T[Variant]> | 'unset';
};
type ConfigVariantsMulti<T extends ComponentSchema> = {
  [Variant in keyof T]?: StringToBoolean<keyof T[Variant]> | StringToBoolean<keyof T[Variant]>[];
};
type ApplyComposition = { apply: Partial<Composition> };
interface Component<T extends ComponentSchema> {
  base?: Partial<Composition>;
  variants?: T;
  defaultVariants?: ConfigVariants<T>;
  compoundVariants?: (T extends ComponentSchema
    ? (ConfigVariants<T> | ConfigVariantsMulti<T>) & ApplyComposition
    : ApplyComposition)[];
}

export interface Composition extends Typography, Dimensions {
  verticalPadding: string;
  horizontalPadding: string;
  paddingTop: string;
  paddingBottom: string;
  paddingLeft: string;
  paddingRight: string;
  border: Border;
  borderTop: string;
  borderRight: string;
  borderBottom: string;
  borderLeft: string;
  borderColor: string;
  borderRadius: number;
  borderRadiusTopLeft: number;
  borderRadiusTopRight: number;
  borderRadiusBottomRight: number;
  borderRadiusBottomLeft: number;
  borderWidth: number;
  borderWidthTop: number;
  borderWidthRight: number;
  borderWidthBottom: number;
  borderWidthLeft: number;
  fill: string;
  sizing: number;
  spacing: number;
  itemSpacing: string;
  backgroundBlur: string;
  boxShadow: BoxShadow;
  opacity: number;
  fontFamilies: string;
  fontWeights: string;
  fontSizes: string;
  lineHeights: string;
  paragraphSpacing: string;
  dimension: string;
  typography: Typography;
}

export interface Token<T extends TokenType = TokenType, V = unknown> {
  name: string;
  value: V;
  type: T;
  description?: string;
}

export interface TokenTypes {
  color: Token<'color', string>;
  spacing: Token<'spacing', number>;
  sizing: Token<'sizing', number>;
  fontWeight: Token<'fontWeight', string>;
  fontSize: Token<'fontSize', string>;
  fontFamily: Token<'fontFamily', string>;
  lineHeight: Token<'lineHeight', string>;
  borderWidth: Token<'borderWidth', number>;
  borderRadius: Token<'borderRadius', number>;
  boxShadow: Token<'boxShadow', BoxShadow>;
  layer: Token<'layer', number>;
  opacity: Token<'opacity', number>;
  textCase: Token<'textCase', string>;
  textDecoration: Token<'textDecoration', string>;
  letterSpacing: Token<'letterSpacing', string>;
  border: Token<'border', Border>;
  dimension: Token<'dimension', Dimension>;
  other: Token<'other', string>;
  typography: Token<'typography', Typography>;
  composition: Token<'composition', Partial<Composition>>;
  component: Token<'component', Component<ComponentSchema>>;
}

export type TokenType = keyof TokenTypes;
export type TokenValue<T extends TokenType> = TokenTypes[T]['value'];

export interface TokenSet {
  id: string;
  name: string;
  tokens: {
    // allow nested tokens
    [key in TokenType]?: Record<string, TokenTypes[key]>;
  };
}
