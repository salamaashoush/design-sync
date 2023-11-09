import { CheckboxCheckedControlsIcon, CheckboxMixedControlsIcon } from '@design-sync/figma-icons';
import { Checkbox as KCheckbox } from '@kobalte/core';
import { ComponentProps } from 'solid-js';
import { control, indicator, label, root } from './checkbox.css';

interface CheckboxProps extends ComponentProps<typeof KCheckbox.Root> {
  label?: string;
}

export function Checkbox(props: CheckboxProps) {
  return (
    <KCheckbox.Root class={root} {...props}>
      <KCheckbox.Input />
      <KCheckbox.Control class={control}>
        <KCheckbox.Indicator class={indicator}>
          {props.indeterminate ? <CheckboxMixedControlsIcon /> : <CheckboxCheckedControlsIcon />}
        </KCheckbox.Indicator>
      </KCheckbox.Control>
      <KCheckbox.Label class={label}>{props.label}</KCheckbox.Label>
    </KCheckbox.Root>
  );
}
