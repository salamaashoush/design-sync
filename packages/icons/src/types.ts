import type { JSX } from 'solid-js';
type SVGSVGElementTags = JSX.SVGElementTags['svg'];

export interface IconProps extends SVGSVGElementTags {
  size?: string | number;
  color?: string;
  title?: string;
  style?: JSX.CSSProperties;
}
