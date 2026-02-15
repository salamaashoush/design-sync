import type { IconProps } from "../types";
export function FontFeatureSmcp32Icon(props: IconProps) {
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
        d="m9.879 20 1.964-5.5h1.313L15.12 20h-.955l-.375-1.05h-2.58L10.835 20h-.956Zm2.62-4.662.97 2.712H11.53l.969-2.712ZM16.88 20l1.964-5.5h1.313L22.12 20h-.955l-.375-1.05h-2.58L17.835 20h-.956Zm2.62-4.662.97 2.712H18.53l.969-2.712Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
