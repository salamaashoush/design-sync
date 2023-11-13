/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/ba727bdc0c4a57626131e84d9c9b661d0b65b754/packages/@react-stately/combobox/src/useComboBoxState.ts
 * https://github.com/adobe/react-spectrum/blob/ba727bdc0c4a57626131e84d9c9b661d0b65b754/packages/@react-aria/combobox/src/useComboBox.ts
 */
import { OverrideComponentProps, ValidationState } from "@kobalte/utils";
import { Component, JSX } from "solid-js";
import { AsChildProp } from "../polymorphic";
import { PopperRootOptions } from "../popper";
import { CollectionNode } from "../primitives";
import { KeyboardDelegate, SelectionBehavior, SelectionMode } from "../selection";
import { ComboboxTriggerMode } from "./types";
export interface ComboboxBaseItemComponentProps<T> {
    /** The item to render. */
    item: CollectionNode<T>;
}
export interface ComboboxBaseSectionComponentProps<T> {
    /** The section to render. */
    section: CollectionNode<T>;
}
export interface ComboboxBaseOptions<Option, OptGroup = never> extends Omit<PopperRootOptions, "anchorRef" | "contentRef" | "onCurrentPlacementChange">, AsChildProp {
    /** The controlled open state of the combobox. */
    open?: boolean;
    /**
     * The default open state when initially rendered.
     * Useful when you do not need to control the open state.
     */
    defaultOpen?: boolean;
    /**
     * Event handler called when the open state of the combobox changes.
     * Returns the new open state and the action that caused the opening of the menu.
     */
    onOpenChange?: (isOpen: boolean, triggerMode?: ComboboxTriggerMode) => void;
    /** Handler that is called when the combobox input value changes. */
    onInputChange?: (value: string) => void;
    /** The controlled value of the combobox. */
    value?: Option[];
    /**
     * The value of the combobox when initially rendered.
     * Useful when you do not need to control the value.
     */
    defaultValue?: Option[];
    /** Event handler called when the value changes. */
    onChange?: (value: Option[]) => void;
    /** The interaction required to display the combobox menu. */
    triggerMode?: ComboboxTriggerMode;
    /** The content that will be rendered when no value or defaultValue is set. */
    placeholder?: JSX.Element;
    /** An array of options to display as the available options. */
    options: Array<Option | OptGroup>;
    /**
     * Property name or getter function to use as the value of an option.
     * This is the value that will be submitted when the combobox is part of a `<form>`.
     */
    optionValue?: keyof Exclude<Option, null> | ((option: Exclude<Option, null>) => string | number);
    /** Property name or getter function to use as the text value of an option for typeahead purpose. */
    optionTextValue?: keyof Exclude<Option, null> | ((option: Exclude<Option, null>) => string);
    /**
     * Property name or getter function to use as the label of an option.
     * This is the string representation of the option to display in the `Combobox.Input`.
     */
    optionLabel?: keyof Exclude<Option, null> | ((option: Exclude<Option, null>) => string);
    /** Property name or getter function to use as the disabled flag of an option. */
    optionDisabled?: keyof Exclude<Option, null> | ((option: Exclude<Option, null>) => boolean);
    /** Property name that refers to the children options of an option group. */
    optionGroupChildren?: keyof Exclude<OptGroup, null>;
    /** An optional keyboard delegate to override the default. */
    keyboardDelegate?: KeyboardDelegate;
    /** The filter function used to determine if an option should be included in the combo box list. */
    defaultFilter?: "startsWith" | "endsWith" | "contains" | ((option: Exclude<Option, null>, inputValue: string) => boolean);
    /** Whether focus should wrap around when the end/start is reached. */
    shouldFocusWrap?: boolean;
    /** Whether the combobox allows the menu to be open when the collection is empty. */
    allowsEmptyCollection?: boolean;
    /** The type of selection that is allowed in the select. */
    selectionMode?: Exclude<SelectionMode, "none">;
    /** How multiple selection should behave in the select. */
    selectionBehavior?: SelectionBehavior;
    /** Whether onValueChange should fire even if the new set of keys is the same as the last. */
    allowDuplicateSelectionEvents?: boolean;
    /** Whether the combobox allows empty selection. */
    disallowEmptySelection?: boolean;
    /**
     * When `selectionMode` is "multiple".
     * Whether the last selected option should be removed when the user press the Backspace key and the input is empty.
     */
    removeOnBackspace?: boolean;
    /** Whether the combobox uses virtual scrolling. */
    virtualized?: boolean;
    /** When NOT virtualized, the component to render as an item in the `Combobox.Listbox`. */
    itemComponent?: Component<ComboboxBaseItemComponentProps<Option>>;
    /** When NOT virtualized, the component to render as a section in the `Combobox.Listbox`. */
    sectionComponent?: Component<ComboboxBaseSectionComponentProps<OptGroup>>;
    /**
     * Whether the combobox should be the only visible content for screen readers.
     * When set to `true`:
     * - interaction with outside elements will be disabled.
     * - scroll will be locked.
     * - focus will be locked inside the select content.
     * - elements outside the combobox content will not be visible for screen readers.
     */
    modal?: boolean;
    /** Whether the scroll should be locked even if the combobox is not modal. */
    preventScroll?: boolean;
    /**
     * Used to force mounting the combobox (portal, positioner and content) when more control is needed.
     * Useful when controlling animation with SolidJS animation libraries.
     */
    forceMount?: boolean;
    /**
     * A unique identifier for the component.
     * The id is used to generate id attributes for nested components.
     * If no id prop is provided, a generated id will be used.
     */
    id?: string;
    /**
     * The name of the combobox.
     * Submitted with its owning form as part of a name/value pair.
     */
    name?: string;
    /** Whether the combobox should display its "valid" or "invalid" visual styling. */
    validationState?: ValidationState;
    /** Whether the user must select an item before the owning form can be submitted. */
    required?: boolean;
    /** Whether the combobox is disabled. */
    disabled?: boolean;
    /** Whether the combobox is read only. */
    readOnly?: boolean;
    /** The children of the combobox. */
    children?: JSX.Element;
}
export interface ComboboxBaseProps<Option, OptGroup = never> extends OverrideComponentProps<"div", ComboboxBaseOptions<Option, OptGroup>>, AsChildProp {
}
/**
 * Base component for a combobox, provide context for its children.
 */
export declare function ComboboxBase<Option, OptGroup = never>(props: ComboboxBaseProps<Option, OptGroup>): JSX.Element;
