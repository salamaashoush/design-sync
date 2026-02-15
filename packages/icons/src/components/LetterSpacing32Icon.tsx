import type { IconProps } from "../types";
export function LetterSpacing32Icon(props: IconProps) {
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
        d="M8 22V10h1v12H8Zm15 0V10h1v12h-1Zm-10.452-2 2.8-8h1.304l2.8 8h-.954l-.7-2h-3.596l-.7 2h-.954ZM16 12.862 17.448 17h-2.896L16 12.862Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
