import type { IconProps } from '../types';
export function AlertIcon(props: IconProps) {
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
        <path
          fill-rule="evenodd"
          d="M21.25 17.393a1.75 1.75 0 0 0 1.75 1.75V20H9v-.857a1.75 1.75 0 0 0 1.75-1.75V14c0-3.314 2.35-6 5.25-6s5.25 2.686 5.25 6zm-1-3.393v3.393c0 .6.192 1.155.518 1.607h-9.536a2.738 2.738 0 0 0 .518-1.607V14c0-2.891 2.024-5 4.25-5s4.25 2.109 4.25 5z"
          clip-rule="evenodd"
        />
        <path d="M16 23a2 2 0 0 1-2-2h-1a3 3 0 1 0 6 0h-1a2 2 0 0 1-2 2z" />
      </g>
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
