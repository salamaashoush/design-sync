import { createContext, useContext } from "solid-js";
export const CalendarContext = createContext();
export function useCalendarContext() {
    const context = useContext(CalendarContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useCalendarContext` must be used within a `Calendar` component");
    }
    return context;
}
