import type { IconProps } from '../types';
export function TextTransformCapitalize16Icon(props: IconProps) {
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
        d="M9.97 12H9V4h1v2.953h.079l.047-.074c.212-.339.6-.957 1.687-.957 1.516 0 2.563 1.203 2.563 3.094 0 1.906-1.047 3.109-2.547 3.109-1.109 0-1.514-.66-1.724-1.004a4.903 4.903 0 0 0-.026-.043h-.11V12Zm1.734-5.25c-1.125 0-1.719.906-1.719 2.25 0 1.36.61 2.297 1.719 2.297 1.156 0 1.75-1.016 1.75-2.297 0-1.266-.578-2.25-1.75-2.25ZM1.049 12l2.8-8h1.303l2.8 8H7l-.7-2H2.702l-.7 2H1.05ZM4.5 4.862 5.949 9H3.052l1.449-4.138Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
