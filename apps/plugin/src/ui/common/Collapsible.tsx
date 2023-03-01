import { createSignal, JSX, ParentProps, Show } from 'solid-js';

interface CollapsibleProps {
  title: string;
  control?: JSX.Element;
}
export function Collapsible(props: ParentProps<CollapsibleProps>) {
  const [isOpen, setIsOpen] = createSignal(false);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div class="border rounded shadow mb-4">
      <div class="flex justify-between items-center p-4 cursor-pointer">
        <h3 class="text-lg font-medium" onClick={toggleOpen}>
          <i class="i-mdi-menu-down h-6 w-6 transform transition-transform" classList={{ 'rotate-180': isOpen() }} />
          {props.title}
        </h3>
        {props.control}
      </div>
      <Show when={isOpen()}>
        <div class="p-4">{props.children}</div>
      </Show>
    </div>
  );
}
