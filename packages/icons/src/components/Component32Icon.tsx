import type { IconProps } from '../types';
export function Component32Icon(props: IconProps) {
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
        d="m12.063 10.938.707.707 2.523 2.523.707.707.707-.707 2.523-2.523.707-.707-.707-.708-2.523-2.523L16 7l-.707.707-2.523 2.523-.707.707Zm6.46 0L16 13.46l-2.523-2.524L16 8.415l2.523 2.524Zm-6.46 10.124.707.708 2.523 2.523L16 25l.707-.707 2.523-2.523.707-.707-.707-.708-2.523-2.523-.707-.707-.707.707-2.523 2.523-.707.707Zm6.46 0L16 23.587l-2.523-2.523L16 18.538l2.523 2.523ZM7.707 16.707 7 16l.707-.707 2.523-2.523.707-.707.708.707 2.523 2.523.707.707-.707.707-2.523 2.523-.707.707-.708-.707-2.523-2.523Zm3.23 1.816L13.462 16l-2.524-2.523L8.415 16l2.524 2.523ZM17.125 16l.707.707 2.523 2.523.707.707.708-.707 2.523-2.523L25 16l-.707-.707-2.523-2.523-.707-.707-.708.707-2.523 2.523-.707.707Zm6.46 0-2.523 2.523L18.54 16l2.523-2.523L23.587 16Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
