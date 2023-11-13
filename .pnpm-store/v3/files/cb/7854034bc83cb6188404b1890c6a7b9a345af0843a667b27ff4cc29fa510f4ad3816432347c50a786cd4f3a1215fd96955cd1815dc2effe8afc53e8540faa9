import { createContext, useContext } from "solid-js";
export const DomCollectionContext = createContext();
export function useOptionalDomCollectionContext() {
    return useContext(DomCollectionContext);
}
export function useDomCollectionContext() {
    const context = useOptionalDomCollectionContext();
    if (context === undefined) {
        throw new Error("[kobalte]: `useDomCollectionContext` must be used within a `DomCollectionProvider` component");
    }
    return context;
}
