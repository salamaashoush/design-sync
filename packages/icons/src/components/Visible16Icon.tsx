import type { IconProps } from "../types";
export function Visible16Icon(props: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
      stroke-width="0"
      style={{
        ...props.style,
        overflow: "visible",
        color: props.color || "currentColor",
      }}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#a)">
        <path
          fill="currentColor"
          fill-opacity=".8"
          fill-rule="evenodd"
          d="M8 11a6.495 6.495 0 0 1-5.478-3A6.495 6.495 0 0 1 8 5c2.3 0 4.322 1.194 5.479 3A6.495 6.495 0 0 1 8 11Zm0-7a7.499 7.499 0 0 1 6.635 4A7.499 7.499 0 0 1 8 12a7.499 7.499 0 0 1-6.635-4A7.499 7.499 0 0 1 8 4Zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
          clip-rule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="currentColor" d="M0 0h16v16H0z" />
        </clipPath>
      </defs>
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
