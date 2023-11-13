import { DomCollectionItem } from "./types";
export interface DomCollectionContextValue<T extends DomCollectionItem = DomCollectionItem> {
    registerItem: (item: T) => () => void;
}
export declare const DomCollectionContext: import("solid-js").Context<DomCollectionContextValue<DomCollectionItem>>;
export declare function useOptionalDomCollectionContext(): DomCollectionContextValue<DomCollectionItem>;
export declare function useDomCollectionContext<T extends DomCollectionItem = DomCollectionItem>(): DomCollectionContextValue<T>;
