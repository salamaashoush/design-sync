import { createContext, useContext } from "solid-js";
export const SliderContext = createContext();
export function useSliderContext() {
    const context = useContext(SliderContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useSliderContext` must be used within a `Slider.Root` component");
    }
    return context;
}
