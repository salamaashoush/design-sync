import type { IconProps } from "../types";
export function Paragraphspacing32Icon(props: IconProps) {
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
        d="M23 9H9V8h14v1Zm-7 .793.354.353 2 2-.708.708-1.146-1.147v4.586l1.146-1.147.708.708-2 2-.354.353-.354-.353-2-2 .708-.708 1.146 1.147v-4.586l-1.146 1.147-.708-.708 2-2L16 9.793ZM23 19v1H9v-1h14Zm0 4v1H9v-1h14Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
