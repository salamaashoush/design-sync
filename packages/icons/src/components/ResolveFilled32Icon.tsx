import type { IconProps } from '../types';
export function ResolveFilled32Icon(props: IconProps) {
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
        d="M16 24a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-.089-5.135 4-4.5-.822-.73-3.613 4.064-2.587-2.588-.778.778 3 3 .413.412.387-.436Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
