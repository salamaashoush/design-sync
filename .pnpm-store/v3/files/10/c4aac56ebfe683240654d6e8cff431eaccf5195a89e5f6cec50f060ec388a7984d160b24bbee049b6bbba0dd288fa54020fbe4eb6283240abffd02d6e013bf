import { Accessor } from "solid-js";
export interface RadioGroupItemDataSet {
    "data-valid": string | undefined;
    "data-invalid": string | undefined;
    "data-required": string | undefined;
    "data-disabled": string | undefined;
    "data-readonly": string | undefined;
    "data-checked": string | undefined;
}
export interface RadioGroupItemContextValue {
    value: Accessor<string>;
    dataset: Accessor<RadioGroupItemDataSet>;
    isSelected: Accessor<boolean>;
    isDisabled: Accessor<boolean>;
    inputId: Accessor<string | undefined>;
    labelId: Accessor<string | undefined>;
    descriptionId: Accessor<string | undefined>;
    inputRef: Accessor<HTMLInputElement | undefined>;
    select: () => void;
    generateId: (part: string) => string;
    registerInput: (id: string) => () => void;
    registerLabel: (id: string) => () => void;
    registerDescription: (id: string) => () => void;
    setIsFocused: (isFocused: boolean) => void;
    setInputRef: (el: HTMLInputElement) => void;
}
export declare const RadioGroupItemContext: import("solid-js").Context<RadioGroupItemContextValue>;
export declare function useRadioGroupItemContext(): RadioGroupItemContextValue;
