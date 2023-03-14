import type { IconProps } from '../types';
export function LockOffIcon(props: IconProps) {
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
      <path
        fill="currentColor"
        d="M18 15h.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 .5-.5H17v-2.5a2.5 2.5 0 0 1 5 0V14h-1v-1.5a1.5 1.5 0 0 0-3 0z"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
