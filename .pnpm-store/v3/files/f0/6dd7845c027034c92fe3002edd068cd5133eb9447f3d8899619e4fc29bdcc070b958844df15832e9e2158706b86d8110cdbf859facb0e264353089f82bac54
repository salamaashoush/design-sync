import { createContext, useContext } from "solid-js";
export const RadioGroupContext = createContext();
export function useRadioGroupContext() {
    const context = useContext(RadioGroupContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useRadioGroupContext` must be used within a `RadioGroup` component");
    }
    return context;
}
