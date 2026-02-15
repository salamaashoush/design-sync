import type { JSX } from "solid-js/jsx-runtime";
import * as styles from "./resizable.css";

export interface ResizableEvent {
  width: number;
  height: number;
}

interface ResizerProps {
  onResize?: (event: ResizableEvent) => void;
}
export function Resizer(props: ResizerProps) {
  let corner!: HTMLDivElement;

  const handleSizeChange = (e: PointerEvent) => {
    const size = {
      width: Math.max(300, Math.floor(e.clientX + 5)),
      height: Math.max(200, Math.floor(e.clientY + 5)),
    };

    props.onResize?.(size);
  };

  const onDown = (e: PointerEvent) => {
    if (corner) {
      corner.onpointermove = handleSizeChange;
      corner.setPointerCapture(e.pointerId);
    }
  };

  const onUp = (e: PointerEvent) => {
    if (corner) {
      corner.onpointermove = null;
      corner.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div
      id="corner"
      onPointerDown={onDown}
      onPointerUp={onUp}
      ref={(el) => (corner = el)}
      class={styles.corner}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
        <path
          d="M9 1L1 9M9 5L5 9M9 9L9 9"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
    </div>
  );
}

interface ResizableProps {
  children: JSX.Element;
  onResize?: (event: ResizableEvent) => void;
}
export function Resizable(props: ResizableProps) {
  return (
    <div class={styles.container}>
      {props.children}
      <Resizer onResize={props.onResize} />
    </div>
  );
}
