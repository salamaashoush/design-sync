import type { IconProps } from '../types';
export function TidyUpListVerticalIcon(props: IconProps) {
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
        <path d="M9.5 10h13v2h-13zM9.5 15h13v2h-13zM22.5 20h-13v2h13z" />
      </g>
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
