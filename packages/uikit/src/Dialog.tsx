import { Dialog as KDialog } from '@kobalte/core';
import { ComponentProps, createContext, createSignal, For, JSX, ParentProps, useContext } from 'solid-js';
import { Icon } from './Icon';
interface ModalProps extends ComponentProps<typeof KDialog.Root> {
  title: string;
  trigger?: JSX.Element;
}
export function Dialog(props: ParentProps<ModalProps>) {
  return (
    <KDialog.Root
      isOpen={props.isOpen}
      defaultIsOpen={props.defaultIsOpen}
      id={props.id}
      isModal={props.isModal}
      forceMount={props.forceMount}
      onOpenChange={props.onOpenChange}
    >
      {props.trigger}
      <KDialog.Portal>
        <KDialog.Overlay class="position-fixed inset-0 z-10" />
        <div class="position-fixed inset-0 z-10 flex justify-content-center align-items-center">
          <KDialog.Content class="rounded">
            <div class="flex px-6 py-4 justify-between border-b-2 border-brand border-b-solid">
              <KDialog.Title class="dialog__title">{props.title}</KDialog.Title>
              <KDialog.CloseButton class="dialog__close-button">
                <Icon name="close" />
              </KDialog.CloseButton>
            </div>
            <KDialog.Description class="dialog__description">{props.children}</KDialog.Description>
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
    throw new Error('useModals must be used within a ModalsProvider');
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
          defaultIsOpen
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
