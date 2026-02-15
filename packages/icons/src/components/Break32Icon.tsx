import type { IconProps } from "../types";
export function Break32Icon(props: IconProps) {
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
        d="M13 9v3h1V9h-1Zm9.103.896a2.975 2.975 0 0 0-4.207 0l-2.75 2.75.707.707 2.75-2.75a1.975 1.975 0 1 1 2.793 2.793l-2.75 2.75.707.707 2.75-2.75a2.975 2.975 0 0 0 0-4.207ZM9.896 22.103a2.975 2.975 0 0 1 0-4.207l2.75-2.75.707.707-2.75 2.75a1.975 1.975 0 1 0 2.793 2.793l2.75-2.75.707.707-2.75 2.75a2.975 2.975 0 0 1-4.207 0ZM23 19h-3v-1h3v1Zm-4 1v3h-1v-3h1Zm-7-7H9v1h3v-1Z"
        clip-rule="evenodd"
        opacity=".9"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
