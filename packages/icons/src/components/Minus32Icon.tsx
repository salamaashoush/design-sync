import type { IconProps } from '../types';
export function Minus32Icon(props: IconProps) {
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
      <path fill="currentColor" fill-opacity=".8" fill-rule="evenodd" d="M21.5 16.5h-11v-1h11v1Z" clip-rule="evenodd" />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
