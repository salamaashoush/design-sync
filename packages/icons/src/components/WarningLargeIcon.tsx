import type { IconProps } from '../types';
export function WarningLargeIcon(props: IconProps) {
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
      <path fill="currentColor" fill-rule="evenodd" d="m16 6 10 18H6zm-1 11v-4h2v4zm0 2v2h2v-2z" clip-rule="evenodd" />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
