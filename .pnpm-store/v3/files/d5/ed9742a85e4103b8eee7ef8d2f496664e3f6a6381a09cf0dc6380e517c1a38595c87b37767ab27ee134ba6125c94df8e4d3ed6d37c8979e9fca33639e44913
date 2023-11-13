/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/5c1920e50d4b2b80c826ca91aff55c97350bf9f9/packages/@react-aria/select/src/useSelect.ts
 */
import { OverrideComponentProps, ValidationState } from "@kobalte/utils";
import { Component, JSX } from "solid-js";
import { AsChildProp } from "../polymorphic";
import { PopperRootOptions } from "../popper";
import { CollectionNode } from "../primitives";
import { KeyboardDelegate, SelectionBehavior, SelectionMode } from "../selection";
export interface SelectBaseItemComponentProps<T> {
    /** The item to render. */
    item: CollectionNode<T>;
}
export interface SelectBaseSectionComponentProps<T> {
    /** The section to render. */
    section: CollectionNode<T>;
}
export interface SelectBaseOptions<Option, OptGroup = never> extends Omit<PopperRootOptions, "anchorRef" | "contentRef" | "onCurrentPlacementChange">, AsChildProp {
    /** The controlled open state of the select. */
    open?: boolean;
    /**
     * The default open state when initially rendered.
     * Useful when you do not need to control the open state.
     */
    defaultOpen?: boolean;
    /** Event handler called when the open state of the select changes. */
    onOpenChange?: (isOpen: boolean) => void;
    /** The controlled value of the select. */
    value?: Option[];
    /**
     * The value of the select when initially rendered.
     * Useful when you do not need to control the value.
     */
    defaultValue?: Option[];
    /** Event handler called when the value changes. */
    onChange?: (value: Option[]) => void;
    /** The content that will be rendered when no value or defaultValue is set. */
    placeholder?: JSX.Element;
    /** An array of options to display as the available options. */
    options: Array<Option | OptGroup>;
    /**
     * Property name or getter function to use as the value of an option.
     * This is the value that will be submitted when the select is part of a `<form>`.
     */
    optionValue?: keyof Exclude<Option, null> | ((option: Exclude<Option, null>) => string | number);
    /** Property name or getter function to use as the text value of an option for typeahead purpose. */
    optionTextValue?: keyof Exclude<Option, null> | ((option: Exclude<Option, null>) => string);
    /** Property name or getter function to use as the disabled flag of an option. */
    optionDisabled?: keyof Exclude<Option, null> | ((option: Exclude<Option, null>) => boolean);
    /** Property name that refers to the children options of an option group. */
    optionGroupChildren?: keyof Exclude<OptGroup, null>;
    /** An optional keyboard delegate implementation for type to select, to override the default. */
    keyboardDelegate?: KeyboardDelegate;
    /** Whether focus should wrap around when the end/start is reached. */
    shouldFocusWrap?: boolean;
    /** The type of selection that is allowed in the select. */
    selectionMode?: Exclude<SelectionMode, "none">;
    /** How multiple selection should behave in the select. */
    selectionBehavior?: SelectionBehavior;
    /** Whether onValueChange should fire even if the new set of keys is the same as the last. */
    allowDuplicateSelectionEvents?: boolean;
    /** Whether the select allows empty selection. */
    disallowEmptySelection?: boolean;
    /** Whether typeahead is disabled. */
    disallowTypeAhead?: boolean;
    /** Whether the select uses virtual scrolling. */
    virtualized?: boolean;
    /** When NOT virtualized, the component to render as an item in the `Select.Listbox`. */
    itemComponent?: Component<SelectBaseItemComponentProps<Option>>;
    /** When NOT virtualized, the component to render as a section in the `Select.Listbox`. */
    sectionComponent?: Component<SelectBaseSectionComponentProps<OptGroup>>;
    /**
     * Whether the select should be the only visible content for screen readers.
     * When set to `true`:
     * - interaction with outside elements will be disabled.
     * - scroll will be locked.
     * - focus will be locked inside the select content.
     * - elements outside the select content will not be visible for screen readers.
     */
    modal?: boolean;
    /** Whether the scroll should be locked even if the select is not modal. */
    preventScroll?: boolean;
    /**
     * Used to force mounting the select (portal, positioner and content) when more control is needed.
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
     * The name of the select.
     * Submitted with its owning form as part of a name/value pair.
     */
    name?: string;
    /** Whether the select should display its "valid" or "invalid" visual styling. */
    validationState?: ValidationState;
    /** Whether the user must select an item before the owning form can be submitted. */
    required?: boolean;
    /** Whether the select is disabled. */
    disabled?: boolean;
    /** Whether the select is read only. */
    readOnly?: boolean;
    /** The children of the select. */
    children?: JSX.Element;
}
export interface SelectBaseProps<Option, OptGroup = never> extends OverrideComponentProps<"div", SelectBaseOptions<Option, OptGroup>>, AsChildProp {
}
/**
 * Base component for a select, provide context for its children.
 * Used to build single and multi-select.
 */
export declare function SelectBase<Option, OptGroup = never>(props: SelectBaseProps<Option, OptGroup>): JSX.Element;
