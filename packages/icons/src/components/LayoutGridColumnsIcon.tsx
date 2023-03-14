import type { IconProps } from '../types';
export function LayoutGridColumnsIcon(props: IconProps) {
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
        <path d="M9 9h3v14H9zM14.5 9h3v14h-3zM20 9h3v14h-3z" />
      </g>
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
