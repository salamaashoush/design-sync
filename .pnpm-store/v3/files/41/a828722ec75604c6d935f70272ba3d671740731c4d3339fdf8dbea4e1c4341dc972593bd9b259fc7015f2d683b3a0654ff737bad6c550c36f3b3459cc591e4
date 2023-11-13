import { Accessor } from "solid-js";
export interface SwitchDataSet {
    "data-checked": string | undefined;
}
export interface SwitchContextValue {
    value: Accessor<string>;
    dataset: Accessor<SwitchDataSet>;
    checked: Accessor<boolean>;
    inputRef: Accessor<HTMLInputElement | undefined>;
    generateId: (part: string) => string;
    toggle: () => void;
    setIsChecked: (isChecked: boolean) => void;
    setIsFocused: (isFocused: boolean) => void;
    setInputRef: (el: HTMLInputElement) => void;
}
export declare const SwitchContext: import("solid-js").Context<SwitchContextValue>;
export declare function useSwitchContext(): SwitchContextValue;
