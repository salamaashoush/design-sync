import type { IconProps } from '../types';
export function VerticalPaddingIcon(props: IconProps) {
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
        <path d="M9 9h14v1H9zm0 13h14v1H9z" />
        <path fill-rule="evenodd" d="M19 13h-6v6h6zm-7-1v8h8v-8z" clip-rule="evenodd" />
      </g>
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
