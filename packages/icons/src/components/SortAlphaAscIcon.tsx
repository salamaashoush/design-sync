import type { IconProps } from '../types';
export function SortAlphaAscIcon(props: IconProps) {
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
      <g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
        <path d="M10.897 9 9 14h1.07l.379-1h2.133l.338 1h1.056l-1.69-5zm1.347 3-.667-1.973L10.828 12zM12.553 19H9.5v-1H14v.979L10.932 22H14v1H9.5v-.993zM20.5 8.293l3.354 3.353-.708.708L21 10.207V23h-1V10.207l-2.146 2.147-.708-.708z" />
      </g>
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
