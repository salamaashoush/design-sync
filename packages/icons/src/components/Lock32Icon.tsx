import type { IconProps } from '../types';
export function Lock32Icon(props: IconProps) {
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
        d="M17.5 13.5V15h-3v-1.5a1.5 1.5 0 0 1 3 0Zm-4 1.5v-1.5a2.5 2.5 0 0 1 5 0V15h.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 .5-.5h.5Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
