import type { IconProps } from '../types';
export function HorizontalPaddingIcon(props: IconProps) {
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
        <path d="M9 9v14h1V9zm13 0v14h1V9z" />
        <path fill-rule="evenodd" d="M13 19v-6h6v6zm-1-7h8v8h-8z" clip-rule="evenodd" />
      </g>
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
