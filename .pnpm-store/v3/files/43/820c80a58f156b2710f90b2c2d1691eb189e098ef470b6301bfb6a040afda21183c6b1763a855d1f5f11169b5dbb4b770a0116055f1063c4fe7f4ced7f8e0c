import { createContext, useContext } from "solid-js";
export const ContextMenuContext = createContext();
export function useOptionalContextMenuContext() {
    return useContext(ContextMenuContext);
}
export function useContextMenuContext() {
    const context = useOptionalContextMenuContext();
    if (context === undefined) {
        throw new Error("[kobalte]: `useContextMenuContext` must be used within a `ContextMenu` component");
    }
    return context;
}
