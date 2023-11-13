import { createContext, useContext } from "solid-js";
export const MenuContext = createContext();
export function useOptionalMenuContext() {
    return useContext(MenuContext);
}
export function useMenuContext() {
    const context = useOptionalMenuContext();
    if (context === undefined) {
        throw new Error("[kobalte]: `useMenuContext` must be used within a `Menu` component");
    }
    return context;
}
