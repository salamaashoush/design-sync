import { createContext, useContext } from "solid-js";
export const MenuRadioGroupContext = createContext();
export function useMenuRadioGroupContext() {
    const context = useContext(MenuRadioGroupContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useMenuRadioGroupContext` must be used within a `Menu.RadioGroup` component");
    }
    return context;
}
