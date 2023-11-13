import { createContext, useContext } from "solid-js";
export const MenuGroupContext = createContext();
export function useMenuGroupContext() {
    const context = useContext(MenuGroupContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useMenuGroupContext` must be used within a `Menu.Group` component");
    }
    return context;
}
