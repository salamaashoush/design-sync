import type { IconProps } from '../types';
export function FontFeatureSubs32Icon(props: IconProps) {
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
        d="m11.548 20 2.8-8h1.304l2.8 8h-.954l-.7-2h-3.596l-.7 2h-.954ZM15 12.862 16.448 17h-2.896L15 12.862ZM20 18h2v3h-1v-2h-1v-1Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
