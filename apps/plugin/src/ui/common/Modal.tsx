import { createContext, createSignal, For, JSX, ParentProps, useContext } from 'solid-js';
import { Portal } from 'solid-js/web';

interface ModalProps {
  title: string;
  onClose?: () => void;
}
export function Modal(props: ParentProps<ModalProps>) {
  return (
    <Portal>
      <div class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75" />
          </div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>

          <div
            class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                  {props.title}
                </h3>
                <div class="mt-2">{props.children}</div>
              </div>
            </div>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => props.onClose?.()}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
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
        <Modal title={modal.title} onClose={() => closeModal(modal.id)}>
          {modal.content}
        </Modal>
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
