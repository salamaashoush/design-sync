import type { IconProps } from '../types';
export function Lineheight32Icon(props: IconProps) {
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
        d="M23 10H9V9h14v1Zm0 13H9v-1h14v1Zm-10.452-3 2.8-8h1.304l2.8 8h-.954l-.7-2h-3.596l-.7 2h-.954ZM16 12.862 17.448 17h-2.896L16 12.862Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
