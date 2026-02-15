import type { IconProps } from "../types";
export function Play32Icon(props: IconProps) {
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
      <path
        fill="currentColor"
        fill-opacity=".8"
        fill-rule="evenodd"
        d="m13 10.098.765.478 8 5 .678.424-.678.424-8 5-.765.478V10.098Zm1 1.804v8.196L20.557 16 14 11.902Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
