import { createContext, useContext } from "solid-js";
export const CalendarGridBodyCellContext = createContext();
export function useCalendarGriBodyCellContext() {
    const context = useContext(CalendarGridBodyCellContext);
    if (context === undefined) {
        throw new Error("[kobalte]: `useCalendarGriBodyCellContext` must be used within a `Calendar.GridBodyCell` component");
    }
    return context;
}
