import { createContext, useContext } from "solid-js";
export const PaginationContext = createContext();
export function usePaginationContext() {
    const context = useContext(PaginationContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `usePaginationContext` must be used within a `Pagination` component");
    }
    return context;
}
