import type { IconProps } from "../types";
export function Trash32Icon(props: IconProps) {
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
        d="M15 9.5a1 1 0 0 0-1 1h4a1 1 0 0 0-1-1h-2Zm4 1a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2h-3v1h1v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-10h1v-1h-3Zm1 1h-8v10a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-10Zm-6 7v-4h1v4h-1Zm3 0v-4h1v4h-1Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
