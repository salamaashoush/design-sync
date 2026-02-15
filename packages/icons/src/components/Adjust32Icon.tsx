import type { IconProps } from "../types";
export function Adjust32Icon(props: IconProps) {
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
        d="M12 16.05V9h1v7.05a2.5 2.5 0 0 1 0 4.9V23h-1v-2.05a2.5 2.5 0 0 1 0-4.9Zm2 2.45a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm5 4.5h1v-7.05a2.5 2.5 0 0 0 0-4.9V9h-1v2.05a2.5 2.5 0 0 0 0 4.9V23Zm2-9.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
