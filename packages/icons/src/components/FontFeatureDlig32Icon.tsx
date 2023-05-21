import type { IconProps } from '../types';
export function FontFeatureDlig32Icon(props: IconProps) {
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
        d="M11 16a3.5 3.5 0 0 1 4.505-3.354A4.48 4.48 0 0 0 14 16a4.48 4.48 0 0 0 1.505 3.354A3.503 3.503 0 0 1 11 16Zm5.505 4.03c.607.3 1.29.47 2.014.47a4.52 4.52 0 0 0 3.913-2.25l-.864-.502a3.538 3.538 0 0 1-4.065 1.604c.353-.317.656-.689.895-1.102A4.704 4.704 0 0 0 19 16a4.704 4.704 0 0 0-.602-2.25 4.519 4.519 0 0 0-.896-1.102 3.538 3.538 0 0 1 4.066 1.604l.864-.503A4.52 4.52 0 0 0 18.52 11.5c-.724 0-1.407.17-2.014.47a4.5 4.5 0 1 0 0 8.06Zm-.001-6.9c.42.293.771.676 1.028 1.12.313.534.473 1.09.468 1.75a3.284 3.284 0 0 1-.468 1.75 3.52 3.52 0 0 1-1.028 1.12 3.492 3.492 0 0 1 0-5.74Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
