/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/selection/src/useSelectableList.ts
 */
import { MaybeAccessor } from "@kobalte/utils";
import { Accessor } from "solid-js";
import { Collection, CollectionNode } from "../primitives";
import { FocusStrategy, KeyboardDelegate, MultipleSelectionManager } from "../selection";
export interface CreateSelectableListProps {
    /** State of the collection. */
    collection: Accessor<Collection<CollectionNode>>;
    /** An interface for reading and updating multiple selection state. */
    selectionManager: MaybeAccessor<MultipleSelectionManager>;
    /** A delegate that returns collection item keys with respect to visual layout. */
    keyboardDelegate?: MaybeAccessor<KeyboardDelegate | undefined>;
    /** Whether the collection or one of its items should be automatically focused upon render. */
    autoFocus?: MaybeAccessor<boolean | FocusStrategy | undefined>;
    /** Whether the autofocus should run on next tick. */
    deferAutoFocus?: MaybeAccessor<boolean | undefined>;
    /** Whether focus should wrap around when the end/start is reached. */
    shouldFocusWrap?: MaybeAccessor<boolean | undefined>;
    /** Whether the collection allows empty selection. */
    disallowEmptySelection?: MaybeAccessor<boolean | undefined>;
    /** Whether selection should occur automatically on focus. */
    selectOnFocus?: MaybeAccessor<boolean | undefined>;
    /** Whether typeahead is disabled. */
    disallowTypeAhead?: MaybeAccessor<boolean | undefined>;
    /** Whether the collection items should use virtual focus instead of being focused directly. */
    shouldUseVirtualFocus?: MaybeAccessor<boolean | undefined>;
    /** Whether navigation through tab key is enabled. */
    allowsTabNavigation?: MaybeAccessor<boolean | undefined>;
    /** Whether the option is contained in a virtual scroller. */
    isVirtualized?: MaybeAccessor<boolean | undefined>;
    /** When virtualized, the Virtualizer function used to scroll to the item of the key provided. */
    scrollToKey?: MaybeAccessor<((key: string) => void) | undefined>;
}
/**
 * Handles interactions with a selectable list.
 * @param props Props for the list.
 * @param ref A ref to the list element.
 * @param scrollRef The ref attached to the scrollable body. Used to provide automatic scrolling on item focus for non-virtualized collections. If not provided, defaults to the collection ref.
 */
export declare function createSelectableList<T extends HTMLElement, U extends HTMLElement = T>(props: CreateSelectableListProps, ref: Accessor<T | undefined>, scrollRef?: Accessor<U | undefined>): {
    tabIndex: Accessor<0 | -1>;
    onKeyDown: import("solid-js").JSX.EventHandler<HTMLElement, KeyboardEvent>;
    onMouseDown: import("solid-js").JSX.EventHandler<HTMLElement, MouseEvent>;
    onFocusIn: import("solid-js").JSX.EventHandler<HTMLElement, FocusEvent>;
    onFocusOut: import("solid-js").JSX.EventHandler<HTMLElement, FocusEvent>;
};
