import type { IconProps } from "../types";
export function CheckboxCheckedControlsIcon(props: IconProps) {
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
        d="M3.176 4.824 5.06 6.706l3.765-3.765L10 4.118 5.059 9.059 2 6l1.176-1.176Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
