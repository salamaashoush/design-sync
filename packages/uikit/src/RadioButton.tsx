import {
  Accessor,
  ComponentProps,
  createContext,
  createMemo,
  createSignal,
  ParentProps,
  splitProps,
  useContext,
} from 'solid-js';

const RadioGroupContext = createContext<{
  value: Accessor<string | undefined>;
  name: Accessor<string | undefined>;
  onChange: (value: string | undefined) => void;
}>();

function useRadioGroup() {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error('Radio must be used within RadioGroup');
  }
  return context;
}

interface RadioButtonProps extends ComponentProps<'input'> {
  label: string;
}
export function Radio(props: RadioButtonProps) {
  const { value, name, onChange } = useRadioGroup();
  const [labelProps, inputProps] = splitProps(props, ['label']);
  const id = createMemo(() => props.id ?? 'radio-' + Math.random().toString(36).substring(2, 15));
  return (
    <div class="radio">
      <input
        {...inputProps}
        name={name() ?? inputProps.name}
        id={id()}
        type="radio"
        class="radio__button"
        checked={inputProps.checked || value() === inputProps.value}
        onChange={(e) => {
          onChange(e.currentTarget.value);
        }}
      />
      <label for={id()} class="radio__label">
        {labelProps.label}
      </label>
    </div>
  );
}

interface RadioGroupProps {
  value?: string;
  name?: string;
  defaultValue?: string;
  onChange?: (value?: string) => void;
}

export function RadioGroup(props: ParentProps<RadioGroupProps>) {
  const [value, setValue] = createSignal(props.defaultValue);

  const computedValue = createMemo(() => {
    if (props.value !== undefined) {
      return props.value;
    }
    return value();
  });

  const handleChange = (value?: string) => {
    if (props.value === undefined) {
      setValue(value);
    }
    if (props.onChange) {
      props.onChange(value);
    }
  };

  return (
    <RadioGroupContext.Provider
      value={{
        value: computedValue,
        name: () => props.name,
        onChange: handleChange,
      }}
    >
      <div class="radio-group">{props.children}</div>
    </RadioGroupContext.Provider>
  );
}
