import type { IconProps } from '../types';
export function AdjustIcon(props: IconProps) {
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
      <g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
        <path d="M12 16.05V9h1v7.05a2.5 2.5 0 0 1 0 4.9V23h-1v-2.05a2.5 2.5 0 0 1 0-4.9zm2 2.45a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM19 23h1v-7.05a2.5 2.5 0 0 0 0-4.9V9h-1v2.05a2.5 2.5 0 0 0 0 4.9zm2-9.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z" />
      </g>
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
