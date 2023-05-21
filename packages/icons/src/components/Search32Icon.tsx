import type { IconProps } from '../types';
export function Search32Icon(props: IconProps) {
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
        d="M19.103 15.052a3.552 3.552 0 1 1-7.103 0 3.552 3.552 0 0 1 7.103 0Zm-.706 3.553a4.552 4.552 0 1 1 .707-.707l3.25 3.249-.708.707-3.249-3.25Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
