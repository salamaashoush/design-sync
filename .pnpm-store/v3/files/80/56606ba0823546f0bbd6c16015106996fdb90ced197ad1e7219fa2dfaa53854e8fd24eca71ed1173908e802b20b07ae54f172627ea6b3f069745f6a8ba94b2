import { OverrideComponentProps } from "@kobalte/utils";
import { Accessor, JSX } from "solid-js";
export interface SelectValueState<T> {
    /** The first (or only, in case of single select) selected option. */
    selectedOption: Accessor<T>;
    /** An array of selected options. It will contain only one value in case of single select. */
    selectedOptions: Accessor<T[]>;
    /** A function to remove an option from the selection. */
    remove: (option: T) => void;
    /** A function to clear the selection. */
    clear: () => void;
}
export interface SelectValueOptions<T> {
    /**
     * The children of the select value.
     * Can be a `JSX.Element` or a _render prop_ for having access to the internal state.
     */
    children?: JSX.Element | ((state: SelectValueState<T>) => JSX.Element);
}
export interface SelectValueProps<T> extends OverrideComponentProps<"span", SelectValueOptions<T>> {
}
/**
 * The part that reflects the selected value(s).
 */
export declare function SelectValue<T>(props: SelectValueProps<T>): JSX.Element;
