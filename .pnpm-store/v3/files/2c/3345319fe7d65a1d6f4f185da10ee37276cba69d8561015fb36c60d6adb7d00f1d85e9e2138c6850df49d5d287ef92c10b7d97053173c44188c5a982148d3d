import { createContext, useContext } from "solid-js";
export const CollapsibleContext = createContext();
export function useCollapsibleContext() {
    const context = useContext(CollapsibleContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useCollapsibleContext` must be used within a `Collapsible.Root` component");
    }
    return context;
}
