import { ComponentProps, JSX, splitProps } from 'solid-js';
import { IconButtonVariants, iconButton } from './iconButton.css';

interface IconButtonProps extends ComponentProps<'button'> {
  icon: JSX.Element;
  selected?: boolean;
}

export function IconButton(props: IconButtonProps) {
  const [local, rest] = splitProps(props, ['icon', 'selected']);
  return (
    <button {...rest} class={iconButton({ selected: local.selected || undefined })}>
      {local.icon}
    </button>
  );
}
