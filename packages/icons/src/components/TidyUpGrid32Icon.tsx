import type { IconProps } from "../types";
export function TidyUpGrid32Icon(props: IconProps) {
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
        d="M10 10h2v2h-2v-2Zm10 0h2v2h-2v-2Zm-8 5h-2v2h2v-2Zm8 0h2v2h-2v-2Zm-8 5h-2v2h2v-2Zm8 0h2v2h-2v-2Zm-3-10h-2v2h2v-2Zm-2 5h2v2h-2v-2Zm2 5h-2v2h2v-2Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
