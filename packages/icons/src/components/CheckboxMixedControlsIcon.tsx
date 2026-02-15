import type { IconProps } from "../types";
export function CheckboxMixedControlsIcon(props: IconProps) {
  return (
    <svg
      width="12"
      height="12"
      fill="currentColor"
      viewBox="0 0 12 12"
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
        d="M9 7H3V5h6v2Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
