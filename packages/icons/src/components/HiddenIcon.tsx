import type { IconProps } from '../types';
export function HiddenIcon(props: IconProps) {
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
        d="M21.509 15.801A8.033 8.033 0 0 0 22.928 14h-1.184A6.992 6.992 0 0 1 16 17a6.992 6.992 0 0 1-5.745-3H9.07a8.033 8.033 0 0 0 1.421 1.801l-1.595 1.595.708.707 1.657-1.657c.71.523 1.511.932 2.374 1.199l-.617 2.221.964.268.626-2.255a8.051 8.051 0 0 0 2.784 0l.626 2.255.964-.268-.617-2.221a7.971 7.971 0 0 0 2.374-1.2l1.658 1.658.707-.707z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
