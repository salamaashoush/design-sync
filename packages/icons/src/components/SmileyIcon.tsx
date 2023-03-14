import type { IconProps } from '../types';
export function SmileyIcon(props: IconProps) {
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
      <g fill="currentColor">
        <path d="M16 20a4.002 4.002 0 0 1-3.874-3h1.045a3.001 3.001 0 0 0 5.658 0h1.045A4.002 4.002 0 0 1 16 20zM19.5 14.125a.875.875 0 1 1-1.75 0 .875.875 0 0 1 1.75 0zM13.125 15a.875.875 0 1 0 0-1.75.875.875 0 0 0 0 1.75z" />
        <path
          fill-rule="evenodd"
          d="M24 16a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-1 0a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
          clip-rule="evenodd"
        />
      </g>
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
