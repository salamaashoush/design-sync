import { Checkbox as KCheckbox } from '@kobalte/core';
import { ComponentProps } from 'solid-js';

interface CheckboxProps extends ComponentProps<'input'> {
  label?: string;
}

export function Checkbox(props: CheckboxProps) {
  return (
    <KCheckbox.Root>s</KCheckbox.Root>
    // <div class="checkbox">
    //   <input {...props} id={id()} type="checkbox" class="checkbox__box" />
    //   <Show when={props.label}>
    //     <label for={id()} class="checkbox__label">
    //       {props.label}
    //     </label>
    //   </Show>
    // </div>
  );
}
