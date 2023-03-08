import type { JSX } from 'solid-js/jsx-runtime';
export interface ResizableEvent {
  width: number;
  height: number;
}

interface ResizerProps {
  onResize?: (event: ResizableEvent) => void;
}
export function Resizer(props: ResizerProps) {
  let corner: HTMLDivElement | undefined;

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
      ref={corner}
      class="position-fixed bottom-0 right-0 cursor-se-resize"
    >
      <i class="i-mdi-resize-bottom-right" />
    </div>
  );
}

interface ResizableProps {
  children: JSX.Element;
  onResize?: (event: ResizableEvent) => void;
}
export function Resizable(props: ResizableProps) {
  return (
    <div class="position-fixed inset-0">
      {props.children}
      <Resizer onResize={props.onResize} />
    </div>
  );
}
