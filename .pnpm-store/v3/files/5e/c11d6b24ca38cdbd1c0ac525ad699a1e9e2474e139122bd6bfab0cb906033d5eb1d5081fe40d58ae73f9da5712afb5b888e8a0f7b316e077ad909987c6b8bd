/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/da142672eddefa99365773ced72171facc06fdcb/packages/ariakit/src/collection/collection.tsx
 * https://github.com/ariakit/ariakit/blob/da142672eddefa99365773ced72171facc06fdcb/packages/ariakit/src/collection/collection-state.ts
 * https://github.com/ariakit/ariakit/blob/da142672eddefa99365773ced72171facc06fdcb/packages/ariakit/src/collection/collection-item.ts
 */
import { access, addItemToArray } from "@kobalte/utils";
import { createComponent } from "solid-js";
import { createControllableArraySignal } from "../index";
import { DomCollectionContext } from "./dom-collection-context";
import { createSortBasedOnDOMPosition, findDOMIndex } from "./utils";
export function createDomCollection(props = {}) {
    const [items, setItems] = createControllableArraySignal({
        value: () => access(props.items),
        onChange: value => props.onItemsChange?.(value),
    });
    createSortBasedOnDOMPosition(items, setItems);
    const registerItem = (item) => {
        setItems(prevItems => {
            // Finds the item group based on the DOM hierarchy
            const index = findDOMIndex(prevItems, item);
            return addItemToArray(prevItems, item, index);
        });
        return () => {
            setItems(prevItems => {
                const nextItems = prevItems.filter(prevItem => prevItem.ref() !== item.ref());
                if (prevItems.length === nextItems.length) {
                    // The item isn't registered, so do nothing
                    return prevItems;
                }
                return nextItems;
            });
        };
    };
    const DomCollectionProvider = props => {
        return createComponent(DomCollectionContext.Provider, {
            value: { registerItem },
            get children() {
                return props.children;
            },
        });
    };
    return { DomCollectionProvider };
}
