import type { IconProps } from '../types';
export function Return32Icon(props: IconProps) {
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
        d="m11.707 14 2.647 2.646-.707.708-3.5-3.5-.354-.354.354-.354 3.5-3.5.707.708L11.707 13H15.5c3.576 0 6.5 2.924 6.5 6.5V21h-1v-1.5c0-3.024-2.476-5.5-5.5-5.5h-3.793Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
