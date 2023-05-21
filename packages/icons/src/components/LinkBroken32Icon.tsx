import type { IconProps } from '../types';
export function LinkBroken32Icon(props: IconProps) {
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
        d="M18 14v-2a2 2 0 1 0-4 0v2h-1v-2a3 3 0 1 1 6 0v2h-1Zm1 4h-1v2a2 2 0 1 1-4 0v-2h-1v2a3 3 0 1 0 6 0v-2Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
