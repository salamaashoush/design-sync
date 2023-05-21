import type { IconProps } from '../types';
export function X32Icon(props: IconProps) {
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
        d="m16 15.293 4.646-4.646.708.707L16.707 16l4.647 4.646-.707.708L16 16.707l-4.646 4.647-.707-.707L15.293 16l-4.646-4.646.707-.707L16 15.293Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
