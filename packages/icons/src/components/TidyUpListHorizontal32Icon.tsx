import type { IconProps } from '../types';
export function TidyUpListHorizontal32Icon(props: IconProps) {
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
        d="M10 22.5v-13h2v13h-2Zm5 0v-13h2v13h-2Zm5-13v13h2v-13h-2Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
