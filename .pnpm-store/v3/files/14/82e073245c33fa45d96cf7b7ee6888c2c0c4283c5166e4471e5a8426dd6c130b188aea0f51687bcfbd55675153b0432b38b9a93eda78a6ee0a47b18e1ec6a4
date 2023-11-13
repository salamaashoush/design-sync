import { createContext, useContext } from "solid-js";
export const SelectContext = createContext();
export function useSelectContext() {
    const context = useContext(SelectContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useSelectContext` must be used within a `Select` component");
    }
    return context;
}
