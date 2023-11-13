import { MaybeAccessor } from "@kobalte/utils";
import { DomCollectionItem } from "./types";
export interface CreateDomCollectionItemProps<T extends DomCollectionItem = DomCollectionItem> {
    /** A function to map a data source item to a dom collection item. */
    getItem: () => T;
    /** Whether the item should be registered to the state. */
    shouldRegisterItem?: MaybeAccessor<boolean | undefined>;
}
export declare function createDomCollectionItem<T extends DomCollectionItem = DomCollectionItem>(props: CreateDomCollectionItemProps<T>): void;
