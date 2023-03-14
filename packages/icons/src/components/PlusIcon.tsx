import type { IconProps } from '../types';
export function PlusIcon(props: IconProps) {
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
      <path fill="currentColor" d="M15.5 15.5v-5h1v5h5v1h-5v5h-1v-5h-5v-1z" />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
