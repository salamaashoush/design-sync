import { createContext, useContext } from "solid-js";
export const DatePickerInputContext = createContext();
export function useDatePickerInputContext() {
    const context = useContext(DatePickerInputContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useDatePickerInputContext` must be used within a `DatePicker.Input` component");
    }
    return context;
}
