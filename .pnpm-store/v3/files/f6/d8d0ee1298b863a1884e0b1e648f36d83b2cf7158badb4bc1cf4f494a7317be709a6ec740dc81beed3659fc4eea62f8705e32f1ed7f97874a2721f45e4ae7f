/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-stately/list/src/useSingleSelectListState.ts
 */
import { Accessor } from "solid-js";
import { CollectionBase, CollectionNode } from "../primitives";
import { SingleSelection } from "../selection";
import { ListState } from "./create-list-state";
export interface CreateSingleSelectListStateProps extends CollectionBase, Omit<SingleSelection, "disallowEmptySelection"> {
    /** Filter function to generate a filtered list of nodes. */
    filter?: (nodes: Iterable<CollectionNode>) => Iterable<CollectionNode>;
}
export interface SingleSelectListState extends ListState {
    /** The value of the currently selected item. */
    selectedItem: Accessor<CollectionNode | undefined>;
    /** The key for the currently selected item. */
    selectedKey: Accessor<string | undefined>;
    /** Sets the selected key. */
    setSelectedKey(key: string): void;
}
/**
 * Provides state management for list-like components with single selection.
 * Handles building a collection of items from props, and manages selection state.
 */
export declare function createSingleSelectListState(props: CreateSingleSelectListStateProps): SingleSelectListState;
