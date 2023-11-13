import { createContext, useContext } from "solid-js";
export const MenuItemContext = createContext();
export function useMenuItemContext() {
    const context = useContext(MenuItemContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useMenuItemContext` must be used within a `Menu.Item` component");
    }
    return context;
}
