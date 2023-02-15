import { JSX } from "solid-js/jsx-runtime";
import { children as childrenHelper } from "solid-js";
export interface ResizableEvent {
  width: number;
  height: number;
}

interface ResizerProps {
  onResize?: (event: ResizableEvent) => void;
}
export function Resizer({ onResize }: ResizerProps) {
  let corner: HTMLDivElement | undefined;

  const handleSizeChange = (e: PointerEvent) => {
    const size = {
      width: Math.max(300, Math.floor(e.clientX + 5)),
      height: Math.max(200, Math.floor(e.clientY + 5)),
    };

    onResize?.(size);
  };

  const onDown = (e) => {
    if (corner) {
      corner.onpointermove = handleSizeChange;
      corner.setPointerCapture(e.pointerId);
    }
  };

  const onUp = (e) => {
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
      ref={corner}
      class="position-absolute bottom-0 right-0 cursor-resize"
    >
      <i class="i-ph-frame-corners-thin"></i>
    </div>
  );
}

interface ResizableProps {
  children: JSX.Element;
  onResize?: (event: ResizableEvent) => void;
}
export function Resizable({ children, onResize }: ResizableProps) {
  const c = childrenHelper(() => children);

  return (
    <div class="position-fixed inset-0">
      {c()}
      <Resizer onResize={onResize} />
    </div>
  );
}
