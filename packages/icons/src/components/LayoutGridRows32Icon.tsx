import type { IconProps } from "../types";
export function LayoutGridRows32Icon(props: IconProps) {
  return (
    <svg
      width="32"
      height="32"
      fill="currentColor"
      viewBox="0 0 32 32"
      stroke-width="0"
      style={{
        ...props.style,
        overflow: "visible",
        color: props.color || "currentColor",
      }}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="currentColor" fill-opacity=".8" d="M9 9h14v3H9zM9 14.5h14v3H9zM9 20h14v3H9z" />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
