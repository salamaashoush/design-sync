import type { IconProps } from '../types';
export function RecentIcon(props: IconProps) {
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
        <path d="M15 12v5h5v-1h-4v-4z" />
        <path
          fill-rule="evenodd"
          d="M24 16a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-1 0a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
          clip-rule="evenodd"
        />
      </g>
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
