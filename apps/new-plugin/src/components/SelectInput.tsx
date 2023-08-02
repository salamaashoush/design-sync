import { Dropdown, DropdownOption, Text } from '@create-figma-plugin/ui';
import { ReadonlySignal } from '@preact/signals';
import { JSX, h } from 'preact';
import { forwardRef } from 'preact/compat';
import { FormField } from './FormField';
import { errorStyle } from './formField.css.ts';

type SelectInputProps = {
  name: string;
  label: string;
  options: DropdownOption[];
  placeholder?: string;
  value: ReadonlySignal<string | undefined>;
  error?: ReadonlySignal<string>;
  required?: boolean;
  onChange: JSX.GenericEventHandler<HTMLInputElement>;
};

export const SelectInput = forwardRef<HTMLInputElement, SelectInputProps>(({ label, value, error, ...props }, ref) => {
  return (
    <FormField label={label}>
      <Dropdown
        {...props}
        variant="border"
        id={props.name}
        value={value.value ?? ''}
        aria-invalid={!!error?.value}
        aria-errormessage={`${props.name}-error`}
      />
      {error?.value && (
        <Text className={errorStyle} id={`${props.name}-error`}>
          {error}
        </Text>
      )}
    </FormField>
  );
});
