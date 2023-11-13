import { createContext, useContext } from "solid-js";
export const TabsContext = createContext();
export function useTabsContext() {
    const context = useContext(TabsContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useTabsContext` must be used within a `Tabs` component");
    }
    return context;
}
