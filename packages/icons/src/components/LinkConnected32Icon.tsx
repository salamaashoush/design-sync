import type { IconProps } from '../types';
export function LinkConnected32Icon(props: IconProps) {
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
        d="M16 10a2 2 0 0 1 2 2v2h1v-2a3 3 0 1 0-6 0v2h1v-2a2 2 0 0 1 2-2Zm2 8h1v2a3 3 0 1 1-6 0v-2h1v2a2 2 0 1 0 4 0v-2Zm-2.5-5v6h1v-6h-1Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
