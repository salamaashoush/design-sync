import type { IconProps } from '../types';
export function OrientationLandscape16Icon(props: IconProps) {
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
        d="M2 5v6h12V5H2Zm-1 6v1h14V4H1v7Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
