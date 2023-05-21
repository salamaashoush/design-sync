import type { IconProps } from '../types';
export function VectorHandles32Icon(props: IconProps) {
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
        d="M11.586 16 10.5 14.914 9.414 16l1.086 1.086L11.586 16Zm-.379-1.793L10.5 13.5l-.707.707-1.086 1.086L8 16l.707.707 1.086 1.086.707.707.707-.707 1.086-1.086.207-.207h2.085a1.5 1.5 0 0 0 2.83 0H19.5l.207.207 1.086 1.086.707.707.707-.707 1.086-1.086L24 16l-.707-.707-1.086-1.086-.707-.707-.707.707-1.086 1.086-.207.207h-2.085a1.5 1.5 0 0 0-2.83 0H12.5l-.207-.207-1.086-1.086ZM22.586 16 21.5 14.914 20.414 16l1.086 1.086L22.586 16Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
