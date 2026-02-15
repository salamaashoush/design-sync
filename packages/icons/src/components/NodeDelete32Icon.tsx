import type { IconProps } from "../types";
export function NodeDelete32Icon(props: IconProps) {
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
        d="M15.5 9H9V8h7.5v5.708a2.5 2.5 0 0 1 0 4.584V24H9v-1h6.5v-4.5a2.5 2.5 0 0 1 0-5V9Zm7 7.707 2.646 2.647.708-.708L23.207 16l2.647-2.646-.708-.708-2.646 2.647-2.646-2.647-.708.708L21.793 16l-2.647 2.646.708.708 2.646-2.647Zm-7 .793a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
