import type { IconProps } from "../types";
export function Effects32Icon(props: IconProps) {
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
        d="M16.5 9v-.5h-1v3h1V9Zm-5.096 1.697-.354-.354-.707.707.354.354 1.414 1.414.353.354.708-.708-.354-.353-1.414-1.414Zm9.9.707.353-.354-.707-.707-.354.354-1.414 1.414-.354.353.708.708.353-.354 1.414-1.414ZM9 15.5h-.5v1h3v-1H9Zm12 0h-.5v1h3v-1H21Zm-8.182 4.39.354-.355-.708-.707-.353.354-1.414 1.414-.354.354.707.707.354-.354 1.414-1.414Zm7.071-.708-.354-.354-.707.707.354.354 1.414 1.414.354.354.707-.707-.354-.354-1.414-1.414ZM16.5 21v-.5h-1v3h1V21Zm.998-5.002a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm1 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
