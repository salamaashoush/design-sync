import type { IconProps } from "../types";
export function Swap16Icon(props: IconProps) {
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
      <path
        fill="currentColor"
        fill-opacity=".8"
        fill-rule="evenodd"
        d="m14.61 5.688-1.175 1.468A5.5 5.5 0 0 0 3.432 4.937l.83.557a4.5 4.5 0 0 1 8.215 2.057l-2.2-1.467-.554.832 3 2 .381.254.287-.358 2-2.5-.781-.624Zm-12 1.5-2 2.5.78.624 1.175-1.468a5.484 5.484 0 0 0 1.016 2.43 5.5 5.5 0 0 0 8.986-.21l.001-.001-.83-.557-.002.001A4.5 4.5 0 0 1 3.524 8.45l2.2 1.467.554-.832-3-2-.381-.254-.286.358Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
