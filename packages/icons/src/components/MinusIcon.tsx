import type { IconProps } from '../types';
export function MinusIcon(props: IconProps) {
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
      <path fill="currentColor" d="M21.5 16.5h-11v-1h11z" />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
