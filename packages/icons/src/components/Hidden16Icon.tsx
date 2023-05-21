import type { IconProps } from '../types';
export function Hidden16Icon(props: IconProps) {
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
          d="M13.508 7.801A8.031 8.031 0 0 0 14.93 6h-1.185A6.992 6.992 0 0 1 8 9a6.992 6.992 0 0 1-5.746-3H1.07a8.032 8.032 0 0 0 1.421 1.801L.896 9.396l.708.707L3.26 8.446c.71.523 1.511.932 2.374 1.199l-.617 2.221.964.268.626-2.255a8.05 8.05 0 0 0 2.784 0l.626 2.255.964-.268-.617-2.221a7.974 7.974 0 0 0 2.374-1.2l1.657 1.658.708-.707-1.595-1.595Z"
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
