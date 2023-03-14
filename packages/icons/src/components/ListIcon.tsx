import type { IconProps } from '../types';
export function ListIcon(props: IconProps) {
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
      <g fill="currentColor" fill-opacity=".8">
        <path d="M23 10H9v1h14zM9 15.5h14v1H9zM9 21h14v1H9z" />
      </g>
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
