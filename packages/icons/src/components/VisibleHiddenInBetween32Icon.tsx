import type { IconProps } from "../types";
export function VisibleHiddenInBetween32Icon(props: IconProps) {
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
        d="M20.571 16.005c-3.29.554-5.865.53-9.164-.02C12.69 17.18 14.379 18 16 18c1.612 0 3.29-.81 4.571-1.995Zm1.853-.584C20.989 17.401 18.5 19 16 19c-2.504 0-4.998-1.606-6.432-3.59-.25-.345.066-.775.483-.692 4.511.9 7.403.938 11.885.013.419-.087.739.344.488.69Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
