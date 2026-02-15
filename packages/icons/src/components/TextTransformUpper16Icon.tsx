import type { IconProps } from "../types";
export function TextTransformUpper16Icon(props: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
      stroke-width="0"
      style={{
        ...props.style,
        overflow: "visible",
        color: props.color || "currentColor",
      }}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        fill-opacity=".8"
        fill-rule="evenodd"
        d="m1.049 12 2.8-8h1.303l2.8 8H7l-.7-2H2.702l-.7 2H1.05ZM4.5 4.862 5.949 9H3.052l1.449-4.138ZM11.89 12h-2.89V4h2.796c1.672 0 2.454.953 2.454 2.125 0 1.031-.61 1.484-1.297 1.672v.078c.734.047 1.61.734 1.61 2 0 1.203-.782 2.125-2.673 2.125Zm-1.89-3.64V11h1.921c1.079 0 1.624-.422 1.624-1.125 0-.813-.561-1.516-1.608-1.516h-1.937ZM10 5v2.516h1.765c.875 0 1.51-.547 1.51-1.391 0-.703-.44-1.125-1.447-1.125H10Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
