import type { IconProps } from '../types';
export function ResetInstance32Icon(props: IconProps) {
  return (
    <svg
      width="32"
      height="32"
      fill="currentColor"
      viewBox="0 0 32 32"
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
        d="m6.793 15.5.354-.354 8-8 .353-.353.354.354 8 8 .353.353-.707.707-.354-.353L15.5 8.207 8.207 15.5l7.293 7.293 3.646-3.646.354-.354.707.707-.353.354-4 4-.354.353-.354-.353-8-8-.353-.354Zm7.914-.5H17a6 6 0 0 1 4.243 10.243l-.707-.707A5 5 0 0 0 17 16h-2.294l1.647 1.645-.707.708-2.5-2.5-.354-.354.354-.354 2.5-2.5.707.708L14.707 15Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
