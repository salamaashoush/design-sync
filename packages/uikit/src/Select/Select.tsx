import { Select as KSelect } from '@kobalte/core/select';
import { ComponentProps, For, JSX, Show, splitProps } from 'solid-js';
import * as styles from './select.css';

export interface SelectItem {
  value: string;
  label: string;
}

interface SelectProps<T extends SelectItem = SelectItem> extends Omit<ComponentProps<'div'>, 'onChange'> {
  options: T[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  triggerIcon?: JSX.Element;
}

export function Select<T extends SelectItem = SelectItem>(props: SelectProps<T>) {
  const [local, rest] = splitProps(props, [
    'options',
    'value',
    'defaultValue',
    'onChange',
    'label',
    'placeholder',
    'errorMessage',
    'disabled',
    'required',
    'name',
    'triggerIcon',
  ]);

  return (
    <KSelect<T>
      options={local.options}
      optionValue="value"
      optionTextValue="label"
      value={local.value}
      defaultValue={local.defaultValue}
      onChange={(value) => { if (value) local.onChange?.(value); }}
      placeholder={local.placeholder}
      disabled={local.disabled}
      required={local.required}
      name={local.name}
      validationState={local.errorMessage ? 'invalid' : 'valid'}
      itemComponent={(itemProps) => (
        <KSelect.Item item={itemProps.item} class={styles.item}>
          <KSelect.ItemLabel>{itemProps.item.rawValue.label}</KSelect.ItemLabel>
          <KSelect.ItemIndicator class={styles.itemIndicator}>
            <CheckIcon />
          </KSelect.ItemIndicator>
        </KSelect.Item>
      )}
      {...rest}
    >
      <Show when={local.label}>
        <KSelect.Label class={styles.label}>{local.label}</KSelect.Label>
      </Show>
      <KSelect.Trigger class={styles.trigger}>
        <KSelect.Value<T> class={styles.value}>
          {(state) => state.selectedOption().label}
        </KSelect.Value>
        <KSelect.Icon class={styles.icon}>
          {local.triggerIcon ?? <ChevronDownIcon />}
        </KSelect.Icon>
      </KSelect.Trigger>
      <KSelect.Portal>
        <KSelect.Content class={styles.content}>
          <KSelect.Listbox class={styles.listbox} />
        </KSelect.Content>
      </KSelect.Portal>
      <Show when={local.errorMessage}>
        <KSelect.ErrorMessage class={styles.errorMessage}>{local.errorMessage}</KSelect.ErrorMessage>
      </Show>
    </KSelect>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 5L4 7L8 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}
