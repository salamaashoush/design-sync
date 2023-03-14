import type { IconProps } from '../types';
export function VisibleIcon(props: IconProps) {
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
        <path d="M16 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
        <path
          fill-rule="evenodd"
          d="M16 12a7.499 7.499 0 0 1 6.635 4A7.499 7.499 0 0 1 16 20a7.499 7.499 0 0 1-6.635-4A7.499 7.499 0 0 1 16 12zm0 7a6.495 6.495 0 0 1-5.478-3A6.495 6.495 0 0 1 16 13c2.3 0 4.322 1.194 5.478 3A6.495 6.495 0 0 1 16 19z"
          clip-rule="evenodd"
        />
      </g>
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
