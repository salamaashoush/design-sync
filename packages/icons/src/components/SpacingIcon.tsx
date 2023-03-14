import type { IconProps } from '../types';
export function SpacingIcon(props: IconProps) {
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
      <path fill="currentColor" d="M22 11h-2v10h2v1h-3V10h3zm-10-1v12H9v-1h2V11H9v-1zm4 3h-1v6h1z" />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
