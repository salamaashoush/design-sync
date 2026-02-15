import type { IconProps } from "../types";
export function TextDecorationStrikethrough16Icon(props: IconProps) {
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
        d="M5.904 3.297C6.556 2.77 7.428 2.5 8.349 2.5c.907 0 1.755.228 2.407.742.661.523 1.069 1.301 1.149 2.295l-.997.08c-.06-.75-.353-1.26-.772-1.59C9.707 3.69 9.097 3.5 8.349 3.5c-.735 0-1.373.215-1.816.574-.434.352-.703.855-.703 1.503 0 .615.285 1.013.639 1.292.06.048.122.091.184.131h-1.41a2.537 2.537 0 0 1-.413-1.423c0-.96.412-1.745 1.074-2.28ZM10.824 10h1.069c.069.24.107.507.107.801 0 .972-.373 1.793-1.065 2.361-.68.56-1.622.838-2.707.838-1.1 0-1.986-.31-2.628-.879-.64-.567-.99-1.348-1.096-2.2l.992-.124c.083.66.343 1.2.767 1.575.422.374 1.055.628 1.965.628.925 0 1.619-.237 2.072-.61.442-.363.7-.892.7-1.589 0-.324-.066-.586-.177-.801ZM2 9h12V8H2v1Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
