import type { IconProps } from '../types';
export function AlignVerticalCenter16Icon(props: IconProps) {
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
        d="m8 6.207.354-.353 2-2-.708-.708L8.5 4.293V0h-1v4.293L6.354 3.146l-.708.708 2 2L8 6.207Zm0 3.586.354.353 2 2-.708.708L8.5 11.707V16h-1v-4.293l-1.146 1.147-.708-.708 2-2L8 9.793ZM1 8.5h14v-1H1v1Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
