import type { IconProps } from '../types';
export function LayoutAlignTop32Icon(props: IconProps) {
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
        d="M14.5 22V12h-2v10h2Zm8-12V9h-13v1h13Zm-3 2v6h-2v-6h2Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
