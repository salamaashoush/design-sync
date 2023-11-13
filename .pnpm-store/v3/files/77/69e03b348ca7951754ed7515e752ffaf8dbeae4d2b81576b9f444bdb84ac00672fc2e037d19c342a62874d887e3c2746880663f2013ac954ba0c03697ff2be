import { createContext, useContext } from "solid-js";
export const BreadcrumbsContext = createContext();
export function useBreadcrumbsContext() {
    const context = useContext(BreadcrumbsContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useBreadcrumbsContext` must be used within a `Breadcrumbs.Root` component");
    }
    return context;
}
