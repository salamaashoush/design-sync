import type { IconProps } from '../types';
export function LayoutAlignTopIcon(props: IconProps) {
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
        <path d="M14.5 22V12h-2v10zM22.5 10V9h-13v1zM19.5 12v6h-2v-6z" />
      </g>
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
