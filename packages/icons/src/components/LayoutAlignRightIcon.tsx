import type { IconProps } from '../types';
export function LayoutAlignRightIcon(props: IconProps) {
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
        <path d="M22 22.5h1v-13h-1zM10 14.5h10v-2H10zM20 19.5h-6v-2h6z" />
      </g>
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
