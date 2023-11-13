import { Accessor } from "solid-js";
import { CreatePresenceResult } from "../primitives";
export interface TooltipDataSet {
    "data-expanded": string | undefined;
    "data-closed": string | undefined;
}
export interface TooltipContextValue {
    dataset: Accessor<TooltipDataSet>;
    isOpen: Accessor<boolean>;
    isDisabled: Accessor<boolean>;
    triggerOnFocusOnly: Accessor<boolean>;
    contentId: Accessor<string | undefined>;
    contentPresence: CreatePresenceResult;
    openTooltip: (immediate?: boolean) => void;
    hideTooltip: (immediate?: boolean) => void;
    cancelOpening: () => void;
    generateId: (part: string) => string;
    registerContentId: (id: string) => () => void;
    isTargetOnTooltip: (target: Node | null) => boolean;
    setTriggerRef: (el: HTMLElement) => void;
    setContentRef: (el: HTMLElement) => void;
}
export declare const TooltipContext: import("solid-js").Context<TooltipContextValue>;
export declare function useTooltipContext(): TooltipContextValue;
