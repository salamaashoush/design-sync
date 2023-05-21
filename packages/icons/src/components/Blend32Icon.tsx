import type { IconProps } from '../types';
export function Blend32Icon(props: IconProps) {
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
        d="m16.002 11.002.693.718C18.898 14.012 20 15.294 20 16.852a4.199 4.199 0 0 1-1.172 2.936 3.906 3.906 0 0 1-5.656 0A4.199 4.199 0 0 1 12 16.852c0-1.558 1.102-2.84 3.305-5.132l.694-.719L16 11l.002.002Zm-2.197 3.91c.502-.681 1.219-1.455 2.195-2.472.977 1.017 1.693 1.79 2.195 2.471.6.814.805 1.38.805 1.94v.003c0 .049 0 .098-.003.146h-5.994a3.37 3.37 0 0 1-.003-.146v-.002c0-.56.205-1.127.805-1.94Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
