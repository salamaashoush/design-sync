/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/selection/src/SelectionManager.ts
 */
import { Accessor } from "solid-js";
import { Collection, CollectionNode } from "../primitives";
import { MultipleSelectionManager, MultipleSelectionState, SelectionBehavior, SelectionMode } from "./types";
/**
 * An interface for reading and updating multiple selection state.
 */
export declare class SelectionManager implements MultipleSelectionManager {
    private collection;
    private state;
    constructor(collection: Accessor<Collection<CollectionNode>>, state: MultipleSelectionState);
    /** The type of selection that is allowed in the collection. */
    selectionMode(): SelectionMode;
    /** Whether the collection allows empty selection. */
    disallowEmptySelection(): boolean;
    /** The selection behavior for the collection. */
    selectionBehavior(): SelectionBehavior;
    /** Sets the selection behavior for the collection. */
    setSelectionBehavior(selectionBehavior: SelectionBehavior): void;
    /** Whether the collection is currently focused. */
    isFocused(): boolean;
    /** Sets whether the collection is focused. */
    setFocused(isFocused: boolean): void;
    /** The current focused key in the collection. */
    focusedKey(): string | undefined;
    /** Sets the focused key. */
    setFocusedKey(key?: string): void;
    /** The currently selected keys in the collection. */
    selectedKeys(): Set<string>;
    /** Returns whether a key is selected. */
    isSelected(key: string): boolean;
    /** Whether the selection is empty. */
    isEmpty(): boolean;
    /** Whether all items in the collection are selected. */
    isSelectAll(): boolean;
    firstSelectedKey(): string | undefined;
    lastSelectedKey(): string | undefined;
    /** Extends the selection to the given key. */
    extendSelection(toKey: string): void;
    private getKeyRange;
    private getKeyRangeInternal;
    private getKey;
    /** Toggles whether the given key is selected. */
    toggleSelection(key: string): void;
    /** Replaces the selection with only the given key. */
    replaceSelection(key: string): void;
    /** Replaces the selection with the given keys. */
    setSelectedKeys(keys: Iterable<string>): void;
    /** Selects all items in the collection. */
    selectAll(): void;
    /**
     * Removes all keys from the selection.
     */
    clearSelection(): void;
    /**
     * Toggles between select all and an empty selection.
     */
    toggleSelectAll(): void;
    select(key: string, e?: PointerEvent): void;
    /** Returns whether the current selection is equal to the given selection. */
    isSelectionEqual(selection: Set<string>): boolean;
    canSelectItem(key: string): boolean;
    isDisabled(key: string): boolean;
    private getAllSelectableKeys;
}
