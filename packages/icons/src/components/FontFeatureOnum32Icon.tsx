import type { IconProps } from "../types";
export function FontFeatureOnum32Icon(props: IconProps) {
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
        d="M12 20H17v-1H13.204c.485-1.138 1.234-1.7 1.96-2.22l.082-.059c.397-.284.828-.592 1.153-.988.37-.45.598-1.002.598-1.747A2.492 2.492 0 0 0 14.5 11.5a2.492 2.492 0 0 0-2.498 2.486h1c0-.818.668-1.486 1.498-1.486s1.497.668 1.498 1.486c0 .512-.147.84-.371 1.113-.239.29-.569.527-1.005.84l-.04.028c-.898.644-2.015 1.478-2.563 3.396L12 19.43V20Zm-5-5.434 2.223-1.482.126-.084H10v7H9v-5.566l-2 1.334v-1.202Zm16.884-.746.116-.139V13h-5v1h3.433l-1.817 2.18-.683.82H21c1.104 0 2.023.923 2.023 2.018 0 1.085-.91 1.982-2.023 1.982a1.988 1.988 0 0 1-1.977-2h-1c0 1.64 1.315 3 2.977 3 1.646 0 3.023-1.326 3.023-2.982 0-1.322-.88-2.465-2.082-2.866l1.944-2.332Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
