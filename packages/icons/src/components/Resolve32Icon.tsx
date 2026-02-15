import type { IconProps } from "../types";
export function Resolve32Icon(props: IconProps) {
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
        d="M23 16a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm1 0a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8.089 2.865 4-4.5-.822-.73-3.613 4.064-2.587-2.588-.778.778 3 3 .413.412.387-.436Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
