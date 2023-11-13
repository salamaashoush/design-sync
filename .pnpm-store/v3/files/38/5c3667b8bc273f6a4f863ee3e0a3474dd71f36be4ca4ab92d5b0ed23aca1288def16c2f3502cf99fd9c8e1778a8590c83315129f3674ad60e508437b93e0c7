import { createContext, useContext } from "solid-js";
export const ListboxContext = createContext();
export function useListboxContext() {
    const context = useContext(ListboxContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useListboxContext` must be used within a `Listbox` component");
    }
    return context;
}
