import type { IconProps } from '../types';
export function LayoutGridColumns32Icon(props: IconProps) {
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
      <path fill="currentColor" fill-opacity=".8" d="M9 9h3v14H9zM14.5 9h3v14h-3zM20 9h3v14h-3z" />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
