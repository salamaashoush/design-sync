import type { IconProps } from '../types';
export function ComponentIcon(props: IconProps) {
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
        d="M12.063 10.938 16 14.874l3.938-3.938L16 7zm6.46 0L16 13.46l-2.523-2.524L16 8.415zm-6.46 10.124L16 25l3.938-3.938L16 17.125zm6.46 0L16 23.587l-2.523-2.523L16 18.538zM7 16l3.937-3.938L14.875 16l-3.938 3.938zm3.937 2.523L13.461 16l-2.524-2.523L8.415 16zM17.125 16l3.938 3.938L25 16l-3.938-3.938zm6.46 0-2.523 2.523L18.54 16l2.523-2.523z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
