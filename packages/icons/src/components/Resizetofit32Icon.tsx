import type { IconProps } from "../types";
export function Resizetofit32Icon(props: IconProps) {
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
        d="M8.646 9.354 12.293 13H10v1h4v-4h-1v2.293L9.354 8.646l-.708.708ZM19.707 13l3.647-3.646-.707-.708L19 12.293V10h-1v4h4v-1h-2.293Zm0 6 3.647 3.646-.707.708L19 19.707V22h-1v-4h4v1h-2.293Zm-7.414 0-3.647 3.646.708.708L13 19.707V22h1v-4h-4v1h2.293Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
