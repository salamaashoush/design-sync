import { OverrideComponentProps } from "@kobalte/utils";
import { AsChildProp } from "../polymorphic";
import { ComboboxBaseOptions } from "./combobox-base";
export interface ComboboxSingleSelectionOptions<T> {
    /** The controlled value of the combobox. */
    value?: T;
    /**
     * The value of the combobox when initially rendered.
     * Useful when you do not need to control the value.
     */
    defaultValue?: T;
    /** Event handler called when the value changes. */
    onChange?: (value: T) => void;
    /** Whether the combobox allow multiple selection. */
    multiple?: false;
}
export interface ComboboxMultipleSelectionOptions<T> {
    /** The controlled value of the combobox. */
    value?: T[];
    /**
     * The value of the combobox when initially rendered.
     * Useful when you do not need to control the value.
     */
    defaultValue?: T[];
    /** Event handler called when the value changes. */
    onChange?: (value: T[]) => void;
    /** Whether the combobox allow multiple selection. */
    multiple: true;
}
export type ComboboxRootOptions<Option, OptGroup = never> = (ComboboxSingleSelectionOptions<Option> | ComboboxMultipleSelectionOptions<Option>) & AsChildProp & Omit<ComboboxBaseOptions<Option, OptGroup>, "value" | "defaultValue" | "onChange" | "selectionMode">;
export type ComboboxRootProps<Option, OptGroup = never> = OverrideComponentProps<"div", ComboboxRootOptions<Option, OptGroup>>;
/**
 * A combo box combines a text input with a listbox, allowing users to filter a list of options to items matching a query.
 */
export declare function ComboboxRoot<Option, OptGroup = never>(props: ComboboxRootProps<Option, OptGroup>): import("solid-js").JSX.Element;
