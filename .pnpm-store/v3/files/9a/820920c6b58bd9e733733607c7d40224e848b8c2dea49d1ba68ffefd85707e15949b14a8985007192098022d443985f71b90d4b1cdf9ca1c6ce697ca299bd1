import { createContext, useContext } from "solid-js";
export const CheckboxContext = createContext();
export function useCheckboxContext() {
    const context = useContext(CheckboxContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useCheckboxContext` must be used within a `Checkbox` component");
    }
    return context;
}
