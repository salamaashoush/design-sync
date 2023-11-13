import { createContext, useContext } from "solid-js";
export const CalendarGridContext = createContext();
export function useCalendarGridContext() {
    const context = useContext(CalendarGridContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useCalendarGridContext` must be used within a `Calendar.Grid` component");
    }
    return context;
}
