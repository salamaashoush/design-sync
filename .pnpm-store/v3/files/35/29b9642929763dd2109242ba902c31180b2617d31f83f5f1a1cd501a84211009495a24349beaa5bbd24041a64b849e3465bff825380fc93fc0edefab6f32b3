import { createContext, useContext } from "solid-js";
export const FormControlContext = createContext();
export function useFormControlContext() {
    const context = useContext(FormControlContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useFormControlContext` must be used within a `FormControlContext.Provider` component");
    }
    return context;
}
