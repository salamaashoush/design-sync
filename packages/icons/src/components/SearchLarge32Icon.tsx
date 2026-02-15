import type { IconProps } from "../types";
export function SearchLarge32Icon(props: IconProps) {
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
        d="M20 15a5 5 0 1 1-10 0 5 5 0 0 1 10 0Zm-1.126 4.581a6 6 0 1 1 .707-.707l4.273 4.272-.708.708-4.272-4.273Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
