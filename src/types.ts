export type Ref<T extends string> = `$${T}` | `{${T}}`;
export type UnRef<T extends Ref<string>> = T extends `$${infer R}`
  ? R
  : T extends `{${infer R}}`
  ? R
  : T;
export type RefOrValue<T> = T | Ref<string>;

export type Side =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "horizontal"
  | "vertical";

export type Dimension = "width" | "height";
export type Sides = Side | Side[] | "all";
export type SidesFor<T extends string> = `${T}${Capitalize<Side>}`;

export interface SpacingTokenOptions {
  sides?: Readonly<SidesFor<"padding"> | SidesFor<"padding">[] | "all" | "gap">;
}

export interface SizingTokenOptions {
  dimension?: Dimension | "all";
}

export interface Token<T extends TokenType = TokenType, V = unknown> {
  name: string;
  value: V;
  type: T;
  description?: string;
}

export interface BoxShadow {
  x: RefOrValue<number>;
  y: RefOrValue<number>;
  blur: RefOrValue<number>;
  spread: RefOrValue<number>;
  color: RefOrValue<string>;
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
  fontFamily: RefOrValue<string>;
  fontWeight: RefOrValue<string>;
  fontSize: RefOrValue<string>;
  lineHeight: RefOrValue<string>;
  letterSpacing: RefOrValue<string>;
  textDecoration: RefOrValue<string>;
  textCase: RefOrValue<string>;
  color: RefOrValue<string>;
}

export interface Composition extends Typography, Dimensions {
  verticalPadding: RefOrValue<string>;
  horizontalPadding: RefOrValue<string>;
  paddingTop: RefOrValue<string>;
  paddingBottom: RefOrValue<string>;
  paddingLeft: RefOrValue<string>;
  paddingRight: RefOrValue<string>;
  borderRadius: RefOrValue<string>;
  border: RefOrValue<string>;
  borderTop: RefOrValue<string>;
  borderRight: RefOrValue<string>;
  borderBottom: RefOrValue<string>;
  borderLeft: RefOrValue<string>;
  borderColor: RefOrValue<string>;
  borderRadiusTopLeft: RefOrValue<string>;
  borderRadiusTopRight: RefOrValue<string>;
  borderRadiusBottomRight: RefOrValue<string>;
  borderRadiusBottomLeft: RefOrValue<string>;
  borderWidth: RefOrValue<string>;
  borderWidthTop: RefOrValue<string>;
  borderWidthRight: RefOrValue<string>;
  borderWidthBottom: RefOrValue<string>;
  borderWidthLeft: RefOrValue<string>;
  fill: RefOrValue<string>;
  sizing: RefOrValue<string>;
  spacing: RefOrValue<string>;
  itemSpacing: RefOrValue<string>;
  backgroundBlur: RefOrValue<string>;
  boxShadow: RefOrValue<string>;
  opacity: RefOrValue<string>;
  fontFamilies: RefOrValue<string>;
  fontWeights: RefOrValue<string>;
  fontSizes: RefOrValue<string>;
  lineHeights: RefOrValue<string>;
  paragraphSpacing: RefOrValue<string>;
  dimension: RefOrValue<string>;
}

export interface TokenTypes {
  color: Token<"color", string>;
  spacing: Token<"spacing", number>;
  sizing: Token<"sizing", number>;
  fontWeight: Token<"fontWeight", string>;
  fontSize: Token<"fontSize", number>;
  lineHeight: Token<"lineHeight", string>;
  borderWidth: Token<"borderWidth", number>;
  borderRadius: Token<"borderRadius", number>;
  boxShadow: Token<"boxShadow", BoxShadow>;
  zIndex: Token<"zIndex", string>;
  opacity: Token<"opacity", string>;
  textCase: Token<"textCase", string>;
  textDecoration: Token<"textDecoration", string>;
  letterSpacing: Token<"letterSpacing", string>;
  border: Token<"border", Border>;
  dimension: Token<"dimension", Dimension>;
  other: Token<"other", string>;
  typography: Token<"typography", Typography>;
  composition: Token<"composition", Partial<Composition>>;
}

export type TokenType = keyof TokenTypes;

export interface TokenSet {
  name: string;
  tokens: {
    // allow nested tokens
    [key in TokenType]?: Record<string, TokenTypes[key]>;
  };
}
