import { createContext, useContext } from "solid-js";
export const TooltipContext = createContext();
export function useTooltipContext() {
    const context = useContext(TooltipContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useTooltipContext` must be used within a `Tooltip` component");
    }
    return context;
}
