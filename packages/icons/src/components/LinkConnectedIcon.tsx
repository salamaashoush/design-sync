import type { IconProps } from '../types';
export function LinkConnectedIcon(props: IconProps) {
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
        <path d="M16 10a2 2 0 0 1 2 2v2h1v-2a3 3 0 1 0-6 0v2h1v-2a2 2 0 0 1 2-2zM18 18h1v2a3 3 0 1 1-6 0v-2h1v2a2 2 0 1 0 4 0z" />
        <path d="M15.5 13v6h1v-6z" />
      </g>
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
