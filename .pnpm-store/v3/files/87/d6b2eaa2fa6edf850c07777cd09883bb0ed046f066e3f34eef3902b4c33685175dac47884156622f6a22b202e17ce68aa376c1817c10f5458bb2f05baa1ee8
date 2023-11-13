import { createContext, useContext } from "solid-js";
export const AccordionItemContext = createContext();
export function useAccordionItemContext() {
    const context = useContext(AccordionItemContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useAccordionItemContext` must be used within a `Accordion.Item` component");
    }
    return context;
}
