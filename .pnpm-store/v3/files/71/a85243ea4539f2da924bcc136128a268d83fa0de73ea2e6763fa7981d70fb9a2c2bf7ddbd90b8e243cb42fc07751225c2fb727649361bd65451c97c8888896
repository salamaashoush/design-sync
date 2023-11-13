import { createContext, useContext } from "solid-js";
export const PopoverContext = createContext();
export function usePopoverContext() {
    const context = useContext(PopoverContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `usePopoverContext` must be used within a `Popover` component");
    }
    return context;
}
