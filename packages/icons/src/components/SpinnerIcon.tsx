import type { IconProps } from '../types';
export function SpinnerIcon(props: IconProps) {
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
        fill-rule="evenodd"
        d="M15.165 8.53a.5.5 0 0 1-.404.58A7 7 0 1 0 23 16a.5.5 0 0 1 1 0 8 8 0 1 1-9.416-7.874.5.5 0 0 1 .58.404z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
