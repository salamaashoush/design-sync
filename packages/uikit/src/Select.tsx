import { ComponentProps, createContext, For, JSX, Show, useContext } from 'solid-js';

interface SelectContextType {
  value: string;
  setValue: (value: string) => void;
  selected?: SelectItemProps;
}
const SelectContext = createContext<SelectContextType>();

export function useSelectContext() {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('SelectContext must be used within a Select');
  }
  return context;
}

interface SelectProps extends ComponentProps<'select'> {
  items: SelectItemProps[];
}

export function SelectButton(props: ComponentProps<'button'>) {
  return (
    <button {...props} class="select-menu__button">
      <span class="select-menu__label">{props.children}</span>
      <span class="select-menu__caret" />
    </button>
  );
}

interface SelectItemProps {
  value: string;
  label: string;
  icon?: JSX.Element;
}

function SelectItem(props: SelectItemProps) {
  return (
    <li class="select-menu__item">
      <Show when={props.icon}>
        <span class="select-menu__item-icon">{props.icon}</span>
      </Show>
      <span class="select-menu__item-label">{props.label}</span>
    </li>
  );
}

export function Select(props: SelectProps) {
  return (
    <div class="select-menu">
      <SelectButton>Test</SelectButton>
      <ul class="select-menu__menu select-menu__menu--active">
        <For each={props.items}>{(item) => <SelectItem value={item.value} label={item.label} icon={item.icon} />}</For>
      </ul>
    </div>
  );
}
