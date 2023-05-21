import type { IconProps } from '../types';
export function ArrowDown16Icon(props: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
      stroke-width="0"
      style={{
        ...props.style,
        overflow: 'visible',
        color: props.color || 'currentColor',
      }}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        fill-opacity=".8"
        fill-rule="evenodd"
        d="m8 12.707-.354-.353-3-3 .708-.708L7.5 10.793V2.5h1v8.293l2.146-2.147.708.708-3 3-.354.353Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
