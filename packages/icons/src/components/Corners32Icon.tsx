import type { IconProps } from '../types';
export function Corners32Icon(props: IconProps) {
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
        d="M11 11h3v1h-2v2h-1v-3Zm7 0h3v3h-1v-2h-2v-1Zm-6 9v-2h-1v3h3v-1h-2Zm9-2v3h-3v-1h2v-2h1Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
