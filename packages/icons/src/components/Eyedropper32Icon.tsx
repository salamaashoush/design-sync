import type { IconProps } from "../types";
export function Eyedropper32Icon(props: IconProps) {
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
        d="M22.447 9.6c-.8-.8-2-.8-2.8 0l-2.8 2.8-.8-.7c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l.7.7-5.8 5.8c-.4.4-1 1.9 0 2.9s2.5.4 2.9 0l5.8-5.8.7.7c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4l-.7-.7 2.8-2.8c.8-.9.8-2.1 0-2.9Zm-10.9 11.9h-1v-1l5.8-5.8 1 1c-.1 0-5.8 5.8-5.8 5.8Z"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
