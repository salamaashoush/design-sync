import type { IconProps } from '../types';
export function Smiley32Icon(props: IconProps) {
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
        d="M23 16a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm1 0a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8 4a4.002 4.002 0 0 1-3.874-3h1.045a3.001 3.001 0 0 0 5.658 0h1.045A4.002 4.002 0 0 1 16 20Zm3.5-5.875a.875.875 0 1 1-1.75 0 .875.875 0 0 1 1.75 0ZM13.125 15a.875.875 0 1 0 0-1.75.875.875 0 0 0 0 1.75Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
