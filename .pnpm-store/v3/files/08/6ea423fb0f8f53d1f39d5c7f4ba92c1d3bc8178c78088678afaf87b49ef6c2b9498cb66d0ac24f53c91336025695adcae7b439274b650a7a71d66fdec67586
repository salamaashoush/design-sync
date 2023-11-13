import { Accessor } from "solid-js";
export interface ListboxItemDataSet {
    "data-disabled": string | undefined;
    "data-selected": string | undefined;
    "data-highlighted": string | undefined;
}
export interface ListboxItemContextValue {
    isSelected: Accessor<boolean>;
    dataset: Accessor<ListboxItemDataSet>;
    generateId: (part: string) => string;
    registerLabelId: (id: string) => () => void;
    registerDescriptionId: (id: string) => () => void;
}
export declare const ListboxItemContext: import("solid-js").Context<ListboxItemContextValue>;
export declare function useListboxItemContext(): ListboxItemContextValue;
