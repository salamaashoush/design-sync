import type { IconProps } from '../types';
export function Styles32Icon(props: IconProps) {
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
        d="M11.5 13a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Zm6 0a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Zm1.5 7.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM11.5 19a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
