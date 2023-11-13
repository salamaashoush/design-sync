import { createContext, useContext } from "solid-js";
export const MenuRootContext = createContext();
export function useMenuRootContext() {
    const context = useContext(MenuRootContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useMenuRootContext` must be used within a `MenuRoot` component");
    }
    return context;
}
