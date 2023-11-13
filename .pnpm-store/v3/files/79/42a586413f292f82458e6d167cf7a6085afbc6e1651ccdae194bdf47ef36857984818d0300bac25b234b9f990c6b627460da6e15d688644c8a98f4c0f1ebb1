import { Accessor } from "solid-js";
import { CreatePresenceResult } from "../primitives";
export interface PopoverDataSet {
    "data-expanded": string | undefined;
    "data-closed": string | undefined;
}
export interface PopoverContextValue {
    dataset: Accessor<PopoverDataSet>;
    isOpen: Accessor<boolean>;
    isModal: Accessor<boolean>;
    preventScroll: Accessor<boolean>;
    contentPresence: CreatePresenceResult;
    triggerRef: Accessor<HTMLElement | undefined>;
    contentId: Accessor<string | undefined>;
    titleId: Accessor<string | undefined>;
    descriptionId: Accessor<string | undefined>;
    setDefaultAnchorRef: (el: HTMLElement) => void;
    setTriggerRef: (el: HTMLElement) => void;
    setContentRef: (el: HTMLElement) => void;
    close: () => void;
    toggle: () => void;
    generateId: (part: string) => string;
    registerContentId: (id: string) => () => void;
    registerTitleId: (id: string) => () => void;
    registerDescriptionId: (id: string) => () => void;
}
export declare const PopoverContext: import("solid-js").Context<PopoverContextValue>;
export declare function usePopoverContext(): PopoverContextValue;
