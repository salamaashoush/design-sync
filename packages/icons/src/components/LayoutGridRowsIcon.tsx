import type { IconProps } from '../types';
export function LayoutGridRowsIcon(props: IconProps) {
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
        <path d="M9 9h14v3H9zM9 14.5h14v3H9zM9 20h14v3H9z" />
      </g>
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
