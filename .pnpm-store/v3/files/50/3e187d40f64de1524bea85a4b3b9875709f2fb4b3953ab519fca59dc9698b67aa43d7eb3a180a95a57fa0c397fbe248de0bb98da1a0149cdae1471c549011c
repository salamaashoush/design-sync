import { createContext, useContext } from "solid-js";
export const ListboxItemContext = createContext();
export function useListboxItemContext() {
    const context = useContext(ListboxItemContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useListboxItemContext` must be used within a `Listbox.Item` component");
    }
    return context;
}
