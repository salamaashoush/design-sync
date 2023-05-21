import type { IconProps } from '../types';
export function Noodle16Icon(props: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
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
        d="m11.146 2.854 1.498 1.498c-1.735-.103-2.92.183-3.735.775-1.029.748-1.336 1.896-1.525 2.906-.039.204-.071.397-.103.584-.051.305-.1.592-.165.882-.103.454-.231.833-.427 1.136a1.695 1.695 0 0 1-.842.68 3.13 3.13 0 0 1-.909.19 2 2 0 1 0-.003 1.003c.488-.03.91-.118 1.277-.261.6-.236 1.021-.611 1.317-1.07.29-.447.45-.958.562-1.458.07-.311.128-.652.184-.979.03-.18.06-.358.091-.523.186-.99.441-1.78 1.131-2.281.596-.433 1.61-.717 3.422-.562l-1.773 1.772.708.708 2.5-2.5.353-.354-.353-.354-2.5-2.5-.708.708ZM4 12a1 1 0 1 0-.01.144L4 12Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
