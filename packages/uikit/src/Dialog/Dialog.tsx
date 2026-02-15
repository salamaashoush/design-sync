import { Dialog as KDialog } from "@kobalte/core";
import {
  ComponentProps,
  createContext,
  createSignal,
  For,
  JSX,
  ParentProps,
  useContext,
} from "solid-js";
import * as styles from "./dialog.css";

interface ModalProps extends ComponentProps<typeof KDialog.Root> {
  title: string;
  trigger?: JSX.Element;
}
export function Dialog(props: ParentProps<ModalProps>) {
  return (
    <KDialog.Root
      open={props.open}
      defaultOpen={props.defaultOpen}
      id={props.id}
      modal={props.modal}
      forceMount={props.forceMount}
      onOpenChange={props.onOpenChange}
    >
      {props.trigger}
      <KDialog.Portal>
        <KDialog.Overlay class={styles.overlay} />
        <div class={styles.positioner}>
          <KDialog.Content class={styles.content}>
            <div class={styles.header}>
              <KDialog.Title class={styles.title}>{props.title}</KDialog.Title>
              <KDialog.CloseButton class={styles.closeButton}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M1 1L11 11M11 1L1 11"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
              </KDialog.CloseButton>
            </div>
            <KDialog.Description class={styles.description}>{props.children}</KDialog.Description>
          </KDialog.Content>
        </div>
      </KDialog.Portal>
    </KDialog.Root>
  );
}

interface ModalConfig {
  id: string;
  title: string;
  content: JSX.Element;
}

interface ModalsContextType {
  modals: () => ModalConfig[];
  openModal: (modal: ModalConfig) => void;
  closeModal: (id: string) => void;
}

export function useModals() {
  const context = useContext(ModalsContext);
  if (!context) {
    throw new Error("useModals must be used within a ModalsProvider");
  }
  return context;
}

const ModalsContext = createContext<ModalsContextType>();

export function ModalsContainer() {
  const { modals, closeModal } = useModals();
  return (
    <For each={modals()}>
      {(modal) => (
        <Dialog
          defaultOpen
          title={modal.title}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              closeModal(modal.id);
            }
          }}
        >
          {modal.content}
        </Dialog>
      )}
    </For>
  );
}

export function ModalsProvider(props: ParentProps) {
  const [modals, setModals] = createSignal<ModalConfig[]>([]);

  const openModal = (modal: ModalConfig) => {
    setModals((prev) => [...prev, modal]);
  };

  const closeModal = (id: string) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));
  };

  return (
    <ModalsContext.Provider value={{ modals, openModal, closeModal }}>
      {props.children}
      <ModalsContainer />
    </ModalsContext.Provider>
  );
}

export function createModal(config: ModalConfig) {
  const { openModal, closeModal } = useModals();

  return {
    open: () => openModal(config),
    close: () => closeModal(config.id),
  };
}
