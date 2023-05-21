import { IconContent } from './utils';

export function iconComponentTemplate(icon: IconContent) {
  const svgAttribs = Object.entries({
    ...icon.svgAttribs,
    fill: 'currentColor',
  })
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
  return `
import type { IconProps } from "../types";
export function ${icon.fileName}(props: IconProps) {
  return (
    <svg
      ${svgAttribs}
      stroke-width="0"
      style={{
        ...props.style,
        overflow: "visible",
        color: props.color || "currentColor",
      }}
      {...props}      
      xmlns="http://www.w3.org/2000/svg"
    >
      ${icon.contents}
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}`;
}
