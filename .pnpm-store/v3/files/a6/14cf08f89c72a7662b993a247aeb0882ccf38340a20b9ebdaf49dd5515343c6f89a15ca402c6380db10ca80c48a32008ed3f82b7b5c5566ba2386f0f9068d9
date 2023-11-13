import { Accessor } from "solid-js";
export interface CheckboxDataSet {
    "data-checked": string | undefined;
    "data-indeterminate": string | undefined;
}
export interface CheckboxContextValue {
    value: Accessor<string>;
    dataset: Accessor<CheckboxDataSet>;
    checked: Accessor<boolean>;
    indeterminate: Accessor<boolean>;
    inputRef: Accessor<HTMLInputElement | undefined>;
    generateId: (part: string) => string;
    toggle: () => void;
    setIsChecked: (isChecked: boolean) => void;
    setIsFocused: (isFocused: boolean) => void;
    setInputRef: (el: HTMLInputElement) => void;
}
export declare const CheckboxContext: import("solid-js").Context<CheckboxContextValue>;
export declare function useCheckboxContext(): CheckboxContextValue;
