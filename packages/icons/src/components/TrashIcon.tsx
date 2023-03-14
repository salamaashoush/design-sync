import type { IconProps } from '../types';
export function TrashIcon(props: IconProps) {
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
        <path d="M14 18.5v-4h1v4zM17 18.5v-4h1v4z" />
        <path
          fill-rule="evenodd"
          d="M19 10.5a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2h-3v1h1v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-10h1v-1zm-4-1a1 1 0 0 0-1 1h4a1 1 0 0 0-1-1zm5 2h-8v10a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1z"
          clip-rule="evenodd"
        />
      </g>
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
