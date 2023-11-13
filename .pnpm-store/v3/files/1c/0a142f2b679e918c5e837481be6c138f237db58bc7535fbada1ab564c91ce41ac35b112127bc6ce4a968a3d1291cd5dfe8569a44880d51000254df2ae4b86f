import { createContext, useContext } from "solid-js";
export const ImageContext = createContext();
export function useImageContext() {
    const context = useContext(ImageContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useImageContext` must be used within an `Image.Root` component");
    }
    return context;
}
