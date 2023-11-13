import { Accessor } from "solid-js";
export interface CollapsibleDataSet {
    "data-expanded": string | undefined;
    "data-closed": string | undefined;
    "data-disabled": string | undefined;
}
export interface CollapsibleContextValue {
    dataset: Accessor<CollapsibleDataSet>;
    isOpen: Accessor<boolean>;
    disabled: Accessor<boolean>;
    shouldMount: Accessor<boolean>;
    contentId: Accessor<string | undefined>;
    toggle: () => void;
    generateId: (part: string) => string;
    registerContentId: (id: string) => () => void;
}
export declare const CollapsibleContext: import("solid-js").Context<CollapsibleContextValue>;
export declare function useCollapsibleContext(): CollapsibleContextValue;
