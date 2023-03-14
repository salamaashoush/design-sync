import type { IconProps } from '../types';
export function BreakIcon(props: IconProps) {
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
      <g fill="currentColor" opacity=".9">
        <path d="M13 9v3h1V9zM22.103 9.896a2.975 2.975 0 0 0-4.207 0l-2.75 2.75.707.707 2.75-2.75a1.975 1.975 0 0 1 2.793 2.793l-2.75 2.75.707.707 2.75-2.75a2.975 2.975 0 0 0 0-4.207zM9.896 22.104a2.975 2.975 0 0 1 0-4.208l2.75-2.75.707.707-2.75 2.75a1.975 1.975 0 0 0 2.793 2.793l2.75-2.75.707.707-2.75 2.75a2.975 2.975 0 0 1-4.207 0zM23 19h-3v-1h3zM19 20v3h-1v-3zM12 13H9v1h3z" />
      </g>
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
