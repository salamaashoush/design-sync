import { createContext, useContext } from "solid-js";
export const ComboboxContext = createContext();
export function useComboboxContext() {
    const context = useContext(ComboboxContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useComboboxContext` must be used within a `Combobox` component");
    }
    return context;
}
