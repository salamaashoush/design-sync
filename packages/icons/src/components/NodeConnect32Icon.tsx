import type { IconProps } from "../types";
export function NodeConnect32Icon(props: IconProps) {
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
        d="M15.5 9H9V8h7.5v5.708a2.504 2.504 0 0 1 1.45 1.792h5.343l-2.147-2.146.708-.708 3 3 .353.354-.353.354-3 3-.708-.708 2.147-2.146H17.95a2.504 2.504 0 0 1-1.45 1.792V24H9v-1h6.5v-4.5a2.5 2.5 0 0 1 0-5V9Zm0 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
