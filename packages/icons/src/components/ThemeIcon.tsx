import type { IconProps } from '../types';
export function ThemeIcon(props: IconProps) {
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
        <path
          fill-rule="evenodd"
          d="M13 10h-3v12h3zm-3-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V10a1 1 0 0 0-1-1z"
          clip-rule="evenodd"
        />
        <path d="M10.75 20.5a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0zM22 18a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-7v-1h7v-3h-7v-1zM18.385 17l2.757-2.757a1 1 0 0 0 0-1.415l-2.121-2.12a1 1 0 0 0-1.414 0L15 13.313v1.414l3.314-3.314 2.121 2.122L16.971 17z" />
      </g>
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
