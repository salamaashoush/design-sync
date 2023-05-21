import type { IconProps } from '../types';
export function TextDecorationUnderline16Icon(props: IconProps) {
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
      <path
        fill="currentColor"
        fill-opacity=".8"
        fill-rule="evenodd"
        d="M5.5 8.5V3h-1v5.5a3.5 3.5 0 1 0 7 0V3h-1v5.5a2.5 2.5 0 0 1-5 0ZM2 14v1h12v-1H2Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
