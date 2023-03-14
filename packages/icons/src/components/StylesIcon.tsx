import type { IconProps } from '../types';
export function StylesIcon(props: IconProps) {
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
        <path d="M11.5 13a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0zM17.5 13a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0zM19 20.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM11.5 19a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0z" />
      </g>
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
