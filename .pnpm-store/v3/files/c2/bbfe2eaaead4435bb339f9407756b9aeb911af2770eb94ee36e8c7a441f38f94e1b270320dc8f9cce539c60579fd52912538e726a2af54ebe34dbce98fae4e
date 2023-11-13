/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/selection/src/useTypeSelect.ts
 */
import { MaybeAccessor } from "@kobalte/utils";
import { KeyboardDelegate, MultipleSelectionManager } from "./types";
interface CreateTypeSelectProps {
    /** Whether the type to select should be disabled. */
    isDisabled?: MaybeAccessor<boolean | undefined>;
    /** A delegate that returns collection item keys with respect to visual layout. */
    keyboardDelegate: MaybeAccessor<KeyboardDelegate>;
    /** An interface for reading and updating multiple selection state. */
    selectionManager: MaybeAccessor<MultipleSelectionManager>;
    /** Called when an item is focused by typing. */
    onTypeSelect?: (key: string) => void;
}
/**
 * Handles typeahead interactions with collections.
 */
export declare function createTypeSelect(props: CreateTypeSelectProps): {
    typeSelectHandlers: {
        onKeyDown: (e: KeyboardEvent) => void;
    };
};
export {};
