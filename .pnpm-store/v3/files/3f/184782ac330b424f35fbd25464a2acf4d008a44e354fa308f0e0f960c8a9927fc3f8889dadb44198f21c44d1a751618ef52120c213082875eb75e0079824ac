/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/22cb32d329e66c60f55d4fc4025d1d44bb015d71/packages/@react-aria/listbox/src/useListBox.ts
 */
import { OverrideComponentProps } from "@kobalte/utils";
import { Accessor, JSX } from "solid-js";
import { ListState } from "../list";
import { AsChildProp } from "../polymorphic";
import { Collection, CollectionNode } from "../primitives";
import { FocusStrategy, KeyboardDelegate, SelectionBehavior, SelectionMode } from "../selection";
export interface ListboxRootOptions<Option, OptGroup = never> extends AsChildProp {
    /** The controlled value of the listbox. */
    value?: Iterable<string>;
    /**
     * The value of the listbox when initially rendered.
     * Useful when you do not need to control the state.
     */
    defaultValue?: Iterable<string>;
    /** Event handler called when the value changes. */
    onChange?: (value: Set<string>) => void;
    /** An array of options to display as the available options. */
    options?: Array<Option | OptGroup>;
    /** Property name or getter function to use as the value of an option. */
    optionValue?: keyof Option | ((option: Option) => string);
    /** Property name or getter function to use as the text value of an option for typeahead purpose. */
    optionTextValue?: keyof Option | ((option: Option) => string);
    /** Property name or getter function to use as the disabled flag of an option. */
    optionDisabled?: keyof Option | ((option: Option) => boolean);
    /** Property name or getter function that refers to the children options of option group. */
    optionGroupChildren?: keyof OptGroup | ((optGroup: OptGroup) => Option[]);
    /** The controlled state of the listbox. */
    state?: ListState;
    /** An optional keyboard delegate implementation for type to select, to override the default. */
    keyboardDelegate?: KeyboardDelegate;
    /** Whether to autofocus the listbox or an option. */
    autoFocus?: boolean | FocusStrategy;
    /** Whether focus should wrap around when the end/start is reached. */
    shouldFocusWrap?: boolean;
    /** Whether the listbox items should use virtual focus instead of being focused directly. */
    shouldUseVirtualFocus?: boolean;
    /** Whether selection should occur on press up instead of press down. */
    shouldSelectOnPressUp?: boolean;
    /** Whether options should be focused when the user hovers over them. */
    shouldFocusOnHover?: boolean;
    /**
     * The ref attached to the scrollable element, used to provide automatic scrolling on item focus.
     * If not provided, defaults to the listbox ref.
     */
    scrollRef?: Accessor<HTMLElement | undefined>;
    /** How multiple selection should behave in the listbox. */
    selectionBehavior?: SelectionBehavior;
    /** Whether onValueChange should fire even if the new set of keys is the same as the last. */
    allowDuplicateSelectionEvents?: boolean;
    /** The type of selection that is allowed in the listbox. */
    selectionMode?: SelectionMode;
    /** Whether the listbox allows empty selection. */
    disallowEmptySelection?: boolean;
    /** Whether selection should occur automatically on focus. */
    selectOnFocus?: boolean;
    /** Whether typeahead is disabled. */
    disallowTypeAhead?: boolean;
    /** Whether navigation through tab key is enabled. */
    allowsTabNavigation?: boolean;
    /** Whether the listbox uses virtual scrolling. */
    virtualized?: boolean;
    /** When NOT virtualized, a map function that receives an _item_ signal representing a listbox item. */
    renderItem?: (item: CollectionNode<Option>) => JSX.Element;
    /** When NOT virtualized, a map function that receives a _section_ signal representing a listbox section. */
    renderSection?: (section: CollectionNode<OptGroup>) => JSX.Element;
    /** When virtualized, the Virtualizer function used to scroll to the item of the given key. */
    scrollToItem?: (key: string) => void;
    /** When virtualized, a map function that receives an _items_ signal representing all listbox items and sections. */
    children?: (items: Accessor<Collection<CollectionNode<Option | OptGroup>>>) => JSX.Element;
}
export interface ListboxRootProps<Option, OptGroup = never> extends OverrideComponentProps<"ul", ListboxRootOptions<Option, OptGroup>> {
}
/**
 * Listbox presents a list of options and allows a user to select one or more of them.
 */
export declare function ListboxRoot<Option, OptGroup = never>(props: ListboxRootProps<Option, OptGroup>): JSX.Element;
