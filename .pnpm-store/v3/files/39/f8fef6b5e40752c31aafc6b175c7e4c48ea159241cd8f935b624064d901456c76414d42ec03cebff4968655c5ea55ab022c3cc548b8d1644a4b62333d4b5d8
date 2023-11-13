/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/selection/src/useSelectableList.ts
 */
import { access } from "@kobalte/utils";
import { createMemo } from "solid-js";
import { createCollator } from "../i18n";
import { createSelectableCollection, } from "../selection";
import { ListKeyboardDelegate } from "./list-keyboard-delegate";
/**
 * Handles interactions with a selectable list.
 * @param props Props for the list.
 * @param ref A ref to the list element.
 * @param scrollRef The ref attached to the scrollable body. Used to provide automatic scrolling on item focus for non-virtualized collections. If not provided, defaults to the collection ref.
 */
export function createSelectableList(props, ref, scrollRef) {
    const collator = createCollator({ usage: "search", sensitivity: "base" });
    // By default, a KeyboardDelegate is provided which uses the DOM to query layout information (e.g. for page up/page down).
    const delegate = createMemo(() => {
        const keyboardDelegate = access(props.keyboardDelegate);
        if (keyboardDelegate) {
            return keyboardDelegate;
        }
        return new ListKeyboardDelegate(props.collection, ref, collator);
    });
    return createSelectableCollection({
        selectionManager: () => access(props.selectionManager),
        keyboardDelegate: delegate,
        autoFocus: () => access(props.autoFocus),
        deferAutoFocus: () => access(props.deferAutoFocus),
        shouldFocusWrap: () => access(props.shouldFocusWrap),
        disallowEmptySelection: () => access(props.disallowEmptySelection),
        selectOnFocus: () => access(props.selectOnFocus),
        disallowTypeAhead: () => access(props.disallowTypeAhead),
        shouldUseVirtualFocus: () => access(props.shouldUseVirtualFocus),
        allowsTabNavigation: () => access(props.allowsTabNavigation),
        isVirtualized: () => access(props.isVirtualized),
        scrollToKey: key => access(props.scrollToKey)?.(key),
    }, ref, scrollRef);
}
