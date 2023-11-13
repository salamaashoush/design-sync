import { Accessor } from "solid-js";
import { CreatePresenceResult } from "../primitives";
export interface HoverCardDataSet {
    "data-expanded": string | undefined;
    "data-closed": string | undefined;
}
export interface HoverCardContextValue {
    dataset: Accessor<HoverCardDataSet>;
    isOpen: Accessor<boolean>;
    contentPresence: CreatePresenceResult;
    openWithDelay: () => void;
    closeWithDelay: () => void;
    cancelOpening: () => void;
    cancelClosing: () => void;
    close: () => void;
    isTargetOnHoverCard: (target: Node | null) => boolean;
    setTriggerRef: (el: HTMLElement) => void;
    setContentRef: (el: HTMLElement) => void;
}
export declare const HoverCardContext: import("solid-js").Context<HoverCardContextValue>;
export declare function useHoverCardContext(): HoverCardContextValue;
