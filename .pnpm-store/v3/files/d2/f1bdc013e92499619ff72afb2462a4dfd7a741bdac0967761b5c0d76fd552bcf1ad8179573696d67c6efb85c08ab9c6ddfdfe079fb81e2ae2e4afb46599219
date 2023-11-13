import { Accessor } from "solid-js";
import { ListState } from "../list";
export interface ListboxContextValue {
    listState: Accessor<ListState>;
    generateId: (part: string) => string;
    shouldUseVirtualFocus: Accessor<boolean | undefined>;
    shouldSelectOnPressUp: Accessor<boolean | undefined>;
    shouldFocusOnHover: Accessor<boolean | undefined>;
    isVirtualized: Accessor<boolean | undefined>;
}
export declare const ListboxContext: import("solid-js").Context<ListboxContextValue>;
export declare function useListboxContext(): ListboxContextValue;
