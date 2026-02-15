import type { IconProps } from "../types";
export function Share32Icon(props: IconProps) {
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
        d="M17.5 13a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0ZM20 9.5a3.5 3.5 0 0 0-1.383 6.716A4.513 4.513 0 0 0 16 18.436a4.513 4.513 0 0 0-2.617-2.22 3.501 3.501 0 1 0-2.765 0A4.502 4.502 0 0 0 7.5 20.5V22h17v-1.5c0-2.003-1.309-3.7-3.117-4.284A3.501 3.501 0 0 0 20 9.5ZM16.5 21v-.5a3.5 3.5 0 1 1 7 0v.5h-7Zm-1-.5v.5h-7v-.5a3.5 3.5 0 1 1 7 0Zm-6-7.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
