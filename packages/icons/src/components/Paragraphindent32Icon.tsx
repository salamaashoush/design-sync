import type { IconProps } from '../types';
export function Paragraphindent32Icon(props: IconProps) {
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
        d="m11.854 10.146-2.5-2.5-.708.708L10.293 10H5v1h5.293l-1.647 1.646.708.708 2.5-2.5.353-.354-.353-.354ZM23 10h-9v1h9v-1Zm0 4H9v1h14v-1Zm0 4H9v1h14v-1Zm0 4H9v1h14v-1Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
