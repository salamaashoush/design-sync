import { createContext, useContext } from "solid-js";
export const PopperContext = createContext();
export function usePopperContext() {
    const context = useContext(PopperContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `usePopperContext` must be used within a `Popper` component");
    }
    return context;
}
