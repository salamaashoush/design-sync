import { Accessor, JSX } from "solid-js";
export interface TextFieldContextValue {
    value: Accessor<string | undefined>;
    generateId: (part: string) => string;
    onInput: JSX.EventHandlerUnion<HTMLInputElement | HTMLTextAreaElement, InputEvent>;
}
export declare const TextFieldContext: import("solid-js").Context<TextFieldContextValue>;
export declare function useTextFieldContext(): TextFieldContextValue;
