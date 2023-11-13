import { createContext, useContext } from "solid-js";
export const AccordionContext = createContext();
export function useAccordionContext() {
    const context = useContext(AccordionContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useAccordionContext` must be used within a `Accordion.Root` component");
    }
    return context;
}
