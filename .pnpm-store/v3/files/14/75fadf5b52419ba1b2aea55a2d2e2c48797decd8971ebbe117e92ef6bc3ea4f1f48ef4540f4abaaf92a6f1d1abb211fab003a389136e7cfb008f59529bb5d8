/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/selection/src/useMultipleSelectionState.ts
 */
import { MaybeAccessor } from "@kobalte/utils";
import { MultipleSelection, MultipleSelectionState, SelectionBehavior } from "./types";
export interface CreateMultipleSelectionStateProps extends MultipleSelection {
    /** How multiple selection should behave in the collection. */
    selectionBehavior?: MaybeAccessor<SelectionBehavior | undefined>;
    /** Whether onSelectionChange should fire even if the new set of keys is the same as the last. */
    allowDuplicateSelectionEvents?: MaybeAccessor<boolean | undefined>;
}
/**
 * Manages state for multiple selection and focus in a collection.
 */
export declare function createMultipleSelectionState(props: CreateMultipleSelectionStateProps): MultipleSelectionState;
