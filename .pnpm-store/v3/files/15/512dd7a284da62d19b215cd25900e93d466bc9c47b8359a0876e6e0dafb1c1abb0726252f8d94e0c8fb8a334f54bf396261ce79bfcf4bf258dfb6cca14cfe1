import { createContext, useContext } from "solid-js";
export const ToastRegionContext = createContext();
export function useToastRegionContext() {
    const context = useContext(ToastRegionContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useToastRegionContext` must be used within a `Toast.Region` component");
    }
    return context;
}
