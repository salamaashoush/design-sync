import type { IconProps } from '../types';
export function SearchIcon(props: IconProps) {
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
      <path
        fill="currentColor"
        fill-rule="evenodd"
        d="M18.397 18.605a4.552 4.552 0 1 1 .707-.707l3.25 3.249-.708.707zm.706-3.553a3.552 3.552 0 1 1-7.103 0 3.552 3.552 0 0 1 7.103 0z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
