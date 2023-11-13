import { createContext, useContext } from "solid-js";
export const DialogContext = createContext();
export function useDialogContext() {
    const context = useContext(DialogContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useDialogContext` must be used within a `Dialog` component");
    }
    return context;
}
