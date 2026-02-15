import type { IconProps } from "../types";
export function Visible32Icon(props: IconProps) {
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
        d="M16 19a6.495 6.495 0 0 1-5.478-3A6.495 6.495 0 0 1 16 13c2.3 0 4.322 1.194 5.479 3A6.495 6.495 0 0 1 16 19Zm0-7a7.499 7.499 0 0 1 6.635 4A7.499 7.499 0 0 1 16 20a7.499 7.499 0 0 1-6.635-4A7.499 7.499 0 0 1 16 12Zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
