import type { IconProps } from "../types";
export function Frame32Icon(props: IconProps) {
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
        d="M11 24v-3H8v-1h3v-8H8v-1h3V8h1v3h8V8h1v3h3v1h-3v8h3v1h-3v3h-1v-3h-8v3h-1Zm9-4v-8h-8v8h8Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
