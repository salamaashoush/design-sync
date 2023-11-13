import { createContext, useContext } from "solid-js";
export const HoverCardContext = createContext();
export function useHoverCardContext() {
    const context = useContext(HoverCardContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useHoverCardContext` must be used within a `HoverCard` component");
    }
    return context;
}
