import { createContext, useContext } from "solid-js";
export const DatePickerContext = createContext();
export function useDatePickerContext() {
    const context = useContext(DatePickerContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useDatePickerContext` must be used within a `DatePicker` component");
    }
    return context;
}
