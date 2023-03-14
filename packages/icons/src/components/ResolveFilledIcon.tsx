import type { IconProps } from '../types';
export function ResolveFilledIcon(props: IconProps) {
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
        d="M16 24a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.911-9.635-.822-.73-3.613 4.064-2.587-2.588-.778.778 3.413 3.412z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
