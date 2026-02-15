import { RadioGroup as KRadioGroup } from '@kobalte/core/radio-group';
import { ParentProps, splitProps } from 'solid-js';
import { control, group, item, label } from './radioButton.css';

interface RadioGroupProps extends ParentProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
}

export function RadioGroup(props: RadioGroupProps) {
  const [local, rest] = splitProps(props, ['value', 'defaultValue', 'onChange', 'name', 'children']);
  return (
    <KRadioGroup
      value={local.value}
      defaultValue={local.defaultValue}
      onChange={local.onChange}
      name={local.name}
      class={group}
      {...rest}
    >
      {local.children}
    </KRadioGroup>
  );
}

interface RadioProps {
  value: string;
  label: string;
  disabled?: boolean;
}

export function Radio(props: RadioProps) {
  return (
    <KRadioGroup.Item value={props.value} class={item} disabled={props.disabled}>
      <KRadioGroup.ItemInput />
      <KRadioGroup.ItemControl class={control} />
      <KRadioGroup.ItemLabel class={label}>{props.label}</KRadioGroup.ItemLabel>
    </KRadioGroup.Item>
  );
}
