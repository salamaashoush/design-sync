/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/da142672eddefa99365773ced72171facc06fdcb/packages/ariakit/src/collection/collection.tsx
 * https://github.com/ariakit/ariakit/blob/da142672eddefa99365773ced72171facc06fdcb/packages/ariakit/src/collection/collection-state.ts
 * https://github.com/ariakit/ariakit/blob/da142672eddefa99365773ced72171facc06fdcb/packages/ariakit/src/collection/collection-item.ts
 */
import { MaybeAccessor } from "@kobalte/utils";
import { FlowComponent } from "solid-js";
import { DomCollectionItem } from "./types";
export interface CreateDomCollectionProps<T extends DomCollectionItem = DomCollectionItem> {
    /** The controlled items state of the collection. */
    items?: MaybeAccessor<Array<T> | undefined>;
    /** Event handler called when the items state of the collection changes. */
    onItemsChange?: (items: Array<T>) => void;
}
export declare function createDomCollection<T extends DomCollectionItem = DomCollectionItem>(props?: CreateDomCollectionProps<T>): {
    DomCollectionProvider: FlowComponent<{}, import("solid-js").JSX.Element>;
};
