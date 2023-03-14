import type { IconProps } from '../types';
export function TimerIcon(props: IconProps) {
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
        <path d="M19 8h-6V7h6zM16.5 17v-5h-1v5a.5.5 0 0 0 1 0z" />
        <path
          fill-rule="evenodd"
          d="m22.715 12.65 1.527-1.529L22.122 9l-1.483 1.482a8 8 0 1 0 2.075 2.167zM23 17a7 7 0 1 1-2.384-5.263l.647.647A6.974 6.974 0 0 1 23 17zm-1.008-5.3.13.128.706-.707-.707-.707-.701.701c.2.185.391.38.572.585z"
          clip-rule="evenodd"
        />
      </g>
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
