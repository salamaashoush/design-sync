import type { IconProps } from "../types";
export function ListDetailed32Icon(props: IconProps) {
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
        d="M12 10h-2v1h2v-1Zm0 10h-2v1h2v-1Zm-2-5h2v1h-2v-1Zm12-5h-8v1h8v-1Zm-8 10h8v1h-8v-1Zm8-5h-8v1h8v-1Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
