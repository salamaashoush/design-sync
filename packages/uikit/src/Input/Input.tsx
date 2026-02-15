import { TextField as KTextField } from "@kobalte/core";
import { ComponentProps, JSX, Show, splitProps } from "solid-js";
import * as styles from "./input.css";

interface InputProps extends ComponentProps<typeof KTextField.Root> {
  icon?: JSX.Element;
  label?: string;
  description?: string;
  errorMessage?: string;
  placeholder?: string;
  type?: string;
  onInput?: (e: InputEvent & { currentTarget: HTMLInputElement }) => void;
}

export function Input(props: InputProps) {
  const [local, root] = splitProps(props, [
    "icon",
    "label",
    "description",
    "errorMessage",
    "placeholder",
    "type",
    "onInput",
  ]);

  return (
    <KTextField.Root
      class={styles.root}
      validationState={local.errorMessage ? "invalid" : "valid"}
      {...root}
    >
      <Show when={local.label}>
        <KTextField.Label class={styles.label}>{local.label}</KTextField.Label>
      </Show>
      <Show when={local.description}>
        <KTextField.Description class={styles.description}>
          {local.description}
        </KTextField.Description>
      </Show>
      <div class={styles.fieldWrapper}>
        <Show when={local.icon}>
          <span class={styles.icon}>{local.icon}</span>
        </Show>
        <KTextField.Input
          class={`${styles.field}${local.icon ? ` ${styles.fieldWithIcon}` : ""}`}
          placeholder={local.placeholder}
          type={local.type}
          onInput={local.onInput}
        />
      </div>
      <Show when={local.errorMessage}>
        <KTextField.ErrorMessage class={styles.errorMessage}>
          {local.errorMessage}
        </KTextField.ErrorMessage>
      </Show>
    </KTextField.Root>
  );
}
