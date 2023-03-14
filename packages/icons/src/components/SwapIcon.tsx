import type { IconProps } from '../types';
export function SwapIcon(props: IconProps) {
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
        <path d="m23 13.188-1.175 1.468a5.5 5.5 0 0 0-10.003-2.219l.83.557a4.5 4.5 0 0 1 8.216 2.057l-2.2-1.467-.555.832 3.381 2.254 2.287-2.858zM9 17.188l.78.624 1.176-1.468.026.156a5.5 5.5 0 0 0 9.976 2.065v-.002l-.83-.557-.001.001a4.5 4.5 0 0 1-8.214-2.058l2.2 1.467.555-.832-3.382-2.254z" />
      </g>
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
