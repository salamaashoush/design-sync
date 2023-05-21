import type { IconProps } from '../types';
export function ChevronDownControlsIcon(props: IconProps) {
  return (
    <svg
      width="8"
      height="8"
      fill="currentColor"
      viewBox="0 0 8 8"
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
        d="m3.646 6.354-3-3 .708-.708L4 5.293l2.646-2.647.708.708-3 3L4 6.707l-.354-.353Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
