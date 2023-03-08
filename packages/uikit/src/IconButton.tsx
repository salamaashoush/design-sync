import { ComponentProps, JSX } from 'solid-js';

interface IconButtonProps extends ComponentProps<'button'> {
  icon: JSX.Element;
  selected?: boolean;
}

export function IconButton(props: IconButtonProps) {
  return (
    <button
      {...props}
      class="icon-button"
      classList={{
        'icon-button--selected': props.selected,
      }}
    >
      {props.icon}
    </button>
  );
}
