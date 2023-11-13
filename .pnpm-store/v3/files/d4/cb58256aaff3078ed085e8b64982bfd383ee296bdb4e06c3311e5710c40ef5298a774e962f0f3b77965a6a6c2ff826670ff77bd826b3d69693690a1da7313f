import { OverrideComponentProps } from "@kobalte/utils";
import { Accessor, JSX } from "solid-js";
export interface ComboboxControlState<T> {
    /** The selected options. */
    selectedOptions: Accessor<T[]>;
    /** A function to remove an option from the selection. */
    remove: (option: T) => void;
    /** A function to clear the selection. */
    clear: () => void;
}
export interface ComboboxControlOptions<T> {
    /**
     * The children of the combobox control.
     * Can be a `JSX.Element` or a _render prop_ for having access to the internal state.
     */
    children?: JSX.Element | ((state: ComboboxControlState<T>) => JSX.Element);
}
export interface ComboboxControlProps<T> extends OverrideComponentProps<"div", ComboboxControlOptions<T>> {
}
/**
 * Contains the combobox input and trigger.
 */
export declare function ComboboxControl<T>(props: ComboboxControlProps<T>): JSX.Element;
