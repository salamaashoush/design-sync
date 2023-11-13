import { Accessor, Setter } from "solid-js";
import { CreatePresenceResult } from "../primitives";
export interface DialogContextValue {
    isOpen: Accessor<boolean>;
    modal: Accessor<boolean>;
    preventScroll: Accessor<boolean>;
    contentId: Accessor<string | undefined>;
    titleId: Accessor<string | undefined>;
    descriptionId: Accessor<string | undefined>;
    triggerRef: Accessor<HTMLElement | undefined>;
    overlayPresence: CreatePresenceResult;
    contentPresence: CreatePresenceResult;
    close: () => void;
    toggle: () => void;
    setTriggerRef: Setter<HTMLElement | undefined>;
    generateId: (part: string) => string;
    registerContentId: (id: string) => () => void;
    registerTitleId: (id: string) => () => void;
    registerDescriptionId: (id: string) => () => void;
}
export declare const DialogContext: import("solid-js").Context<DialogContextValue>;
export declare function useDialogContext(): DialogContextValue;
