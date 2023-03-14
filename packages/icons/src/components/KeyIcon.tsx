import type { IconProps } from '../types';
export function KeyIcon(props: IconProps) {
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
        d="M15.14 20.14a3.014 3.014 0 0 0 .331-3.868l2.047-2.047 1.767 1.767a.5.5 0 1 0 .707-.707l-1.767-1.767 1.293-1.293 1.784 1.784a.5.5 0 1 0 .707-.707l-1.784-1.784.762-.761a.5.5 0 0 0-.707-.708l-5.513 5.513a3.014 3.014 0 1 0 .373 4.578zm-.712-.712a2.006 2.006 0 1 0-2.837-2.837 2.006 2.006 0 0 0 2.837 2.837z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
