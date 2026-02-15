import type { IconProps } from "../types";
export function StrokeJoinMiter16Icon(props: IconProps) {
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
      <path fill="currentColor" fill-opacity=".8" d="M14 2H1v6h7v7h6V2Z" />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
