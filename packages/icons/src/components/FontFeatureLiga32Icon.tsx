import type { IconProps } from "../types";
export function FontFeatureLiga32Icon(props: IconProps) {
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
        d="M12.001 20v-6h-1.002v-1h1.002v-.573c0-.736.197-1.305.59-1.707.394-.402.868-.603 1.587-.603.271 0 .54.036.806.108l-.063.952a3.372 3.372 0 0 0-.635-.057c-.38 0-.768.112-.976.336-.207.22-.31.537-.31.952V13H16v-.452c0-.766.218-1.363.654-1.79.44-.428 1.06-.641 1.86-.641.861 0 1.76.304 2.343.603l-.408.891a4.137 4.137 0 0 0-1.853-.434c-.503 0-1.043.112-1.267.336-.22.225-.33.565-.33 1.022V13h1v1h-1v6H16v-6h-3.002v6h-.998ZM21 20h-1v-7h1v7Z"
      />
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
