import { createContext, useContext } from "solid-js";
export const ProgressContext = createContext();
export function useProgressContext() {
    const context = useContext(ProgressContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useProgressContext` must be used within a `Progress.Root` component");
    }
    return context;
}
