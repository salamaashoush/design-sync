import { createContext, useContext } from "solid-js";
export const SwitchContext = createContext();
export function useSwitchContext() {
    const context = useContext(SwitchContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useSwitchContext` must be used within a `Switch` component");
    }
    return context;
}
