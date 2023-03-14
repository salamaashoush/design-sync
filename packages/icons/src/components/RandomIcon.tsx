import type { IconProps } from '../types';
export function RandomIcon(props: IconProps) {
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
          d="M15.118 11a2.5 2.5 0 0 0-1.335.386L11.228 13H18.5v1h-8.497a.512.512 0 0 0-.003.051V20.5c0 .278.223.5.497.5h7.628a.498.498 0 0 0 .328-.123l3.206-2.805a1 1 0 0 0 .341-.753V11.5a.5.5 0 0 0-.5-.5zm-1.869-.46a3.5 3.5 0 0 1 1.87-.54H21.5a1.5 1.5 0 0 1 1.5 1.5v5.82a2 2 0 0 1-.683 1.504l-3.205 2.805c-.274.24-.624.371-.987.371h-7.627C9.668 22 9 21.327 9 20.5v-6.449a1.5 1.5 0 0 1 .699-1.268z"
          clip-rule="evenodd"
        />
        <path d="M13 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM17 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM17 19a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM13 19a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
        <g fill-rule="evenodd" clip-rule="evenodd">
          <path d="M22.407 10.71a.5.5 0 0 1-.116.697l-3.5 2.5a.5.5 0 0 1-.582-.814l3.5-2.5a.5.5 0 0 1 .698.116z" />
          <path d="M18 21v-8h1v8z" />
        </g>
      </g>
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
