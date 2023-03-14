import type { IconProps } from '../types';
export function TidyUpListHorizontalIcon(props: IconProps) {
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
        <path d="M10 22.5v-13h2v13zM15 22.5v-13h2v13zM20 9.5v13h2v-13z" />
      </g>
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
