import { createContext, useContext } from "solid-js";
export const RadioGroupItemContext = createContext();
export function useRadioGroupItemContext() {
    const context = useContext(RadioGroupItemContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useRadioGroupItemContext` must be used within a `RadioGroup.Item` component");
    }
    return context;
}
