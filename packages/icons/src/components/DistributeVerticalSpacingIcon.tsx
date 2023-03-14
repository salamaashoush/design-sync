import type { IconProps } from '../types';
export function DistributeVerticalSpacingIcon(props: IconProps) {
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
        <path d="M9.5 10h13v1h-13zM12.5 15h7v2h-7zM22.5 21h-13v1h13z" />
      </g>
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
