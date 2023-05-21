import type { IconProps } from '../types';
export function MissingFonts32Icon(props: IconProps) {
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
        d="M20.18 17.7h-1.117c-.024-1.462.406-1.95 1.164-2.415.476-.293.828-.7.828-1.277 0-.692-.54-1.133-1.203-1.133-.598 0-1.188.363-1.235 1.191H17.43c.05-1.406 1.105-2.175 2.422-2.175 1.433 0 2.394.859 2.394 2.129 0 .855-.406 1.453-1.105 1.878-.711.438-.961.829-.961 1.801Zm.254 1.593a.781.781 0 1 1-1.563 0c0-.426.352-.777.781-.777.426 0 .782.351.782.777ZM9 20l3.111-8h1.085l3.111 8h-1.073l-.777-2H10.85l-.778 2H9Zm3.654-6.636L14.068 17H11.24l1.414-3.636Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
