import type { IconProps } from "../types";
export function Timer32Icon(props: IconProps) {
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
        d="M19 8h-6V7h6v1Zm4 9a7 7 0 1 1-2.384-5.263l.09.091.557.556A6.974 6.974 0 0 1 23 17Zm-.285-4.35.113-.114.707-.708.707-.707-.707-.707-.707-.707L22.121 9l-.707.707-.707.707-.068.068a8 8 0 1 0 2.075 2.167Zm-.723-.95.13.128.706-.707-.707-.707-.701.702c.2.184.391.38.572.584ZM16.5 17v-5h-1v5a.5.5 0 0 0 1 0Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
