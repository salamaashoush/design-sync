import type { IconProps } from "../types";
export function FontFeatureTnum32Icon(props: IconProps) {
  return (
    <svg
      width="32"
      height="32"
      fill="currentColor"
      viewBox="0 0 32 32"
      stroke-width="0"
      style={{
        ...props.style,
        overflow: "visible",
        color: props.color || "currentColor",
      }}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        fill-opacity=".8"
        fill-rule="evenodd"
        d="M8 11h7v10H8V11Zm-1-1h9v12H7V10Zm2 3.566 2.223-1.482.126-.084H12v7h2v1H9v-1h2v-5.566l-2 1.334v-1.202ZM18 11h7v10h-7V11Zm-1-1h9v12h-9V10Zm7.045 10h-5.047v-.703l2.64-2.89c.926-1.012 1.36-1.56 1.36-2.298 0-.843-.664-1.375-1.531-1.375-.926 0-1.516.606-1.516 1.516h-.922c0-1.406 1.067-2.36 2.469-2.36 1.406 0 2.406.985 2.406 2.22 0 .886-.406 1.574-1.781 3.046l-1.797 1.922v.063h3.719V20Z"
        clip-rule="evenodd"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
