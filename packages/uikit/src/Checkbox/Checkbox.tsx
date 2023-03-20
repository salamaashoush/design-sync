import { Checkbox as KCheckbox } from '@kobalte/core';
import { CheckIcon } from '@tokenize/figma-icons';
import { ComponentProps } from 'solid-js';
import { control, label, root } from './checkbox.css';

interface CheckboxProps extends ComponentProps<typeof KCheckbox.Root> {
  label?: string;
}

export function Checkbox(props: CheckboxProps) {
  return (
    <KCheckbox.Root class={root} {...props}>
      <KCheckbox.Input />
      <KCheckbox.Control class={control}>
        <KCheckbox.Indicator>
          <CheckIcon />
        </KCheckbox.Indicator>
      </KCheckbox.Control>
      <KCheckbox.Label class={label}>{props.label}</KCheckbox.Label>
    </KCheckbox.Root>
  );
}
