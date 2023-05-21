import type { IconProps } from '../types';
export function FontFeatureFrac32Icon(props: IconProps) {
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
        d="m19.411 11.286-7 10-.82-.573 7-10 .82.573Zm.588 9.794c1.244 0 2.15-.713 2.148-1.696.003-.727-.452-1.25-1.267-1.367v-.045c.63-.137 1.054-.605 1.05-1.259.004-.886-.752-1.61-1.914-1.61-1.13 0-2.006.673-2.028 1.647h1.014c.017-.488.471-.792 1.008-.792.543 0 .904.33.9.818.004.508-.417.846-1.019.846h-.514v.813h.514c.736 0 1.173.37 1.17.895.003.514-.443.866-1.065.866-.585 0-1.037-.304-1.062-.778h-1.069c.029.983.907 1.662 2.134 1.662Zm-9.059-8.94c-.212.18-.66.422-1.045.47v-.79c.642-.174.963-.621 1.08-.785a1.99 1.99 0 0 1 .026-.036h1.001v6h-1v-2h-.001v-2.86h-.061Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
