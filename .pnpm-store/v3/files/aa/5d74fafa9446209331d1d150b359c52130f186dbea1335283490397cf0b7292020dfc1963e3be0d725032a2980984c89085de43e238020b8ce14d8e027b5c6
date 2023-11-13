/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/list/src/useListState.ts
 */
import { Accessor } from "solid-js";
import { Collection, CollectionBase, CollectionNode } from "../primitives";
import { CreateMultipleSelectionStateProps, SelectionManager } from "../selection";
export interface CreateListStateProps extends CollectionBase, CreateMultipleSelectionStateProps {
    /** Filter function to generate a filtered list of nodes. */
    filter?: (nodes: Iterable<CollectionNode>) => Iterable<CollectionNode>;
}
export interface ListState {
    /** A collection of items in the list. */
    collection: Accessor<Collection<CollectionNode>>;
    /** A selection manager to read and update multiple selection state. */
    selectionManager: Accessor<SelectionManager>;
}
/**
 * Provides state management for list-like components.
 * Handles building a collection of items from props, and manages multiple selection state.
 */
export declare function createListState(props: CreateListStateProps): ListState;
