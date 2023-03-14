import type { IconProps } from '../types';
export function LayoutAlignLeftIcon(props: IconProps) {
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
        <path d="M10 22.5H9v-13h1zM22 14.5H12v-2h10zM12 19.5h6v-2h-6z" />
      </g>
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
