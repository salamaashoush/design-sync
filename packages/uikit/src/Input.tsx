import { ComponentProps, JSX } from 'solid-js';

interface InputProps extends ComponentProps<'input'> {
  icon?: JSX.Element;
}
export function Input(props: InputProps) {
  return (
    <div
      class="input"
      classList={{
        'input--with-icon': !!props.icon,
      }}
    >
      {props.icon}
      <input {...props} type="input" class="input__field" />
    </div>
  );
}
