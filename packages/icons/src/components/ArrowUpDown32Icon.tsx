import type { IconProps } from "../types";
export function ArrowUpDown32Icon(props: IconProps) {
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
        d="m16 10.293.354.353 2.5 2.5-.707.707-1.646-1.646v7.585l1.646-1.646.707.707-2.5 2.5-.354.354-.353-.354-2.5-2.5.707-.707 1.647 1.646v-7.585l-1.647 1.646-.707-.707 2.5-2.5.353-.354Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
