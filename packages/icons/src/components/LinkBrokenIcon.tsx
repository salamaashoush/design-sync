import type { IconProps } from '../types';
export function LinkBrokenIcon(props: IconProps) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 32 32"
      stroke-width="0"
      style={{
        ...props.style,
        overflow: 'visible',
        color: props.color || 'currentColor',
      }}
      {...props}
      height={props.size || '2em'}
      width={props.size || '2em'}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="currentColor">
        <path d="M18 14v-2a2 2 0 1 0-4 0v2h-1v-2a3 3 0 1 1 6 0v2zM19 18h-1v2a2 2 0 1 1-4 0v-2h-1v2a3 3 0 1 0 6 0z" />
      </g>
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
