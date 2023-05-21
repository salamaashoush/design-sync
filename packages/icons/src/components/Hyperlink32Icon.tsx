import type { IconProps } from '../types';
export function Hyperlink32Icon(props: IconProps) {
  return (
    <svg
      width="32"
      height="32"
      fill="currentColor"
      viewBox="0 0 32 32"
      stroke-width="0"
      style={{
        ...props.style,
        overflow: 'visible',
        color: props.color || 'currentColor',
      }}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        fill-opacity=".8"
        fill-rule="evenodd"
        d="M13.5 18a4.502 4.502 0 0 0 4.244-3h1.049a5.5 5.5 0 1 1 0-3h-1.05A4.502 4.502 0 0 0 9 13.5a4.5 4.5 0 0 0 4.5 4.5Zm5 5a4.5 4.5 0 1 0-4.244-6h-1.049a5.5 5.5 0 1 1 0 3h1.05a4.502 4.502 0 0 0 4.243 3Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
