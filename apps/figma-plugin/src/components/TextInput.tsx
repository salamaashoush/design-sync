import { Text, Textbox } from '@create-figma-plugin/ui';
import { ReadonlySignal } from '@preact/signals';
import { JSX, Ref } from 'preact';
import { forwardRef } from 'preact/compat';
import { FormField } from './FormField.tsx';
import { errorStyle } from './formField.css.ts';

interface TextInputProps {
  name: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'url' | 'date';
  label: string;
  placeholder?: string;
  value?: ReadonlySignal<string | null | undefined>;
  error?: ReadonlySignal<string>;
  required?: boolean;
  ref: Ref<HTMLInputElement>;
  onInput?: JSX.GenericEventHandler<HTMLInputElement>;
  onChange: JSX.GenericEventHandler<HTMLInputElement>;
  onBlur?: JSX.FocusEventHandler<HTMLInputElement>;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(({ label, value, error, ...props }, ref) => {
  return (
    <FormField label={label}>
      <Textbox
        {...props}
        variant="border"
        ref={ref}
        id={props.name}
        value={value?.value ?? ''}
        aria-invalid={!!error}
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
