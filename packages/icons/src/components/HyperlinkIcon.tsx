import type { IconProps } from '../types';
export function HyperlinkIcon(props: IconProps) {
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
        d="m20.824 14.492-1.657 1.657.828.829 1.658-1.657a3.517 3.517 0 0 0-4.973-4.973l-1.657 1.658.829.828 1.657-1.657a2.345 2.345 0 0 1 3.315 3.315zm-4.974 4.972.829.829-1.658 1.657a3.516 3.516 0 1 1-4.972-4.972l1.659-1.658.828.829-1.656 1.657a2.343 2.343 0 1 0 3.315 3.315l1.657-1.657zm2.072-6.216-4.972 4.973.828.829 4.973-4.973z"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
