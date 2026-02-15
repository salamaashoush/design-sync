import type { IconProps } from "../types";
export function BlendEmpty32Icon(props: IconProps) {
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
        d="m16.695 11.72-.693-.718L16 11l-.001.002-.694.718C13.102 14.012 12 15.294 12 16.852a4.199 4.199 0 0 0 1.172 2.936 3.906 3.906 0 0 0 5.656 0A4.199 4.199 0 0 0 20 16.852c0-1.558-1.102-2.84-3.305-5.132Zm-.695.72c-.976 1.017-1.693 1.79-2.195 2.471-.6.814-.805 1.38-.805 1.94v.003a3.2 3.2 0 0 0 .89 2.239 2.906 2.906 0 0 0 4.22 0 3.2 3.2 0 0 0 .89-2.239v-.002c0-.56-.205-1.127-.805-1.94-.502-.681-1.218-1.455-2.195-2.472Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
