import { Dropdown, DropdownOption, Text } from '@create-figma-plugin/ui';
import { h } from 'preact';
import { FormField } from './FormField.tsx';
import { errorStyle } from './formField.css.ts';

interface SelectInputProps {
  name: string;
  label: string;
  options: DropdownOption[];
  placeholder?: string;
  value?: string | null;
  error?: string;
  required?: boolean;
  onValueChange: (value: string) => void;
}

export function SelectInput({ label, value, error, ...props }: SelectInputProps) {
  return (
    <FormField label={label}>
      <Dropdown
        {...props}
        onValueChange={props.onValueChange}
        variant="border"
        id={props.name}
        value={value ?? null}
        aria-invalid={!!error}
        aria-errormessage={`${props.name}-error`}
      />
      {error && (
        <Text className={errorStyle} id={`${props.name}-error`}>
          {error}
        </Text>
      )}
    </FormField>
  );
}
