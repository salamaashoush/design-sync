/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/selection/src/useSelectableItem.ts
 */
import { MaybeAccessor } from "@kobalte/utils";
import { Accessor, JSX } from "solid-js";
import { MultipleSelectionManager } from "./types";
export interface CreateSelectableItemProps {
    /** An interface for reading and updating multiple selection state. */
    selectionManager: MaybeAccessor<MultipleSelectionManager>;
    /** A unique key for the item. */
    key: MaybeAccessor<string>;
    /**
     * By default, selection occurs on pointer down. This can be strange if selecting an
     * item causes the UI to disappear immediately (e.g. menus).
     */
    shouldSelectOnPressUp?: MaybeAccessor<boolean | undefined>;
    /** Whether the option should use virtual focus instead of being focused directly. */
    shouldUseVirtualFocus?: MaybeAccessor<boolean | undefined>;
    /**
     * Whether selection requires the pointer/mouse down and up events to occur on the same target or triggers selection on
     * the target of the pointer/mouse up event.
     */
    allowsDifferentPressOrigin?: MaybeAccessor<boolean | undefined>;
    /** Whether the option is contained in a virtual scroller. */
    virtualized?: MaybeAccessor<boolean | undefined>;
    /** Whether the item is disabled. */
    disabled?: MaybeAccessor<boolean | undefined>;
    /** Function to focus the item. */
    focus?: () => void;
}
/**
 * Handles interactions with an item in a selectable collection.
 * @param props Props for the item.
 * @param ref Ref to the item.
 */
export declare function createSelectableItem<T extends HTMLElement>(props: CreateSelectableItemProps, ref: Accessor<T | undefined>): {
    isSelected: () => boolean;
    isDisabled: () => boolean;
    allowsSelection: () => boolean;
    tabIndex: Accessor<0 | -1>;
    dataKey: Accessor<string>;
    onPointerDown: JSX.EventHandler<any, PointerEvent>;
    onPointerUp: JSX.EventHandler<any, PointerEvent>;
    onClick: JSX.EventHandler<any, MouseEvent>;
    onKeyDown: JSX.EventHandler<any, KeyboardEvent>;
    onMouseDown: (e: MouseEvent) => void;
    onFocus: (e: FocusEvent) => void;
};
