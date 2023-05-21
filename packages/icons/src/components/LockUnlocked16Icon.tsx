import type { IconProps } from '../types';
export function LockUnlocked16Icon(props: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
      stroke-width="0"
      style={{
        ...props.style,
        overflow: 'visible',
        color: props.color || 'currentColor',
      }}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#a)">
        <path
          fill="currentColor"
          fill-opacity=".8"
          fill-rule="evenodd"
          d="M10 6v1h.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 .5-.5H9V4.5a2.5 2.5 0 0 1 5 0V6h-1V4.5a1.5 1.5 0 0 0-3 0V6Z"
          clip-rule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="currentColor" d="M0 0h16v16H0z" />
        </clipPath>
      </defs>
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
