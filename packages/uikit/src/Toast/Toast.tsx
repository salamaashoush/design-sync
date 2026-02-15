import { Show } from "solid-js";
import { ToastVariants, closeButton, toast, toastMessage } from "./toast.css";

type ToastIntent = NonNullable<NonNullable<ToastVariants>["intent"]>;

interface ToastProps {
  message: string;
  intent?: ToastIntent;
  onClose?: () => void;
}

export function Toast(props: ToastProps) {
  return (
    <div class={toast({ intent: props.intent })}>
      <span class={toastMessage}>{props.message}</span>
      <Show when={props.onClose}>
        <button class={closeButton} onClick={props.onClose} aria-label="Close">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M9 3L3 9M3 3l6 6"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </Show>
    </div>
  );
}
