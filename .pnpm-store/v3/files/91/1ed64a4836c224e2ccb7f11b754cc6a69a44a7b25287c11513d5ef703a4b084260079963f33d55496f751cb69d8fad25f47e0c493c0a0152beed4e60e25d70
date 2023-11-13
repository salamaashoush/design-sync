import { createContext, useContext } from "solid-js";
export const TextFieldContext = createContext();
export function useTextFieldContext() {
    const context = useContext(TextFieldContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useTextFieldContext` must be used within a `TextField` component");
    }
    return context;
}
