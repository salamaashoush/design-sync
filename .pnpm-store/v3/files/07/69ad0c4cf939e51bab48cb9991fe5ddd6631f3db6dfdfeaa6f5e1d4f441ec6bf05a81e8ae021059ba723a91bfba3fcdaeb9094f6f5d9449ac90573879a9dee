import { Accessor } from "solid-js";
export interface MenuItemDataSet {
    "data-indeterminate": string | undefined;
    "data-checked": string | undefined;
    "data-disabled": string | undefined;
    "data-highlighted": string | undefined;
}
export interface MenuItemContextValue {
    isChecked: Accessor<boolean | undefined>;
    dataset: Accessor<MenuItemDataSet>;
    setLabelRef: (el: HTMLElement) => void;
    generateId: (part: string) => string;
    registerLabel: (id: string) => () => void;
    registerDescription: (id: string) => () => void;
}
export declare const MenuItemContext: import("solid-js").Context<MenuItemContextValue>;
export declare function useMenuItemContext(): MenuItemContextValue;
