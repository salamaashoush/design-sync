import { ComponentProps, createUniqueId, Show } from 'solid-js';

interface CheckboxProps extends ComponentProps<'input'> {
  label?: string;
}

export function Checkbox(props: CheckboxProps) {
  const id = () => props.id ?? createUniqueId();
  return (
    <div class="checkbox">
      <input {...props} id={id()} type="checkbox" class="checkbox__box" />
      <Show when={props.label}>
        <label for={id()} class="checkbox__label">
          {props.label}
        </label>
      </Show>
    </div>
  );
}
