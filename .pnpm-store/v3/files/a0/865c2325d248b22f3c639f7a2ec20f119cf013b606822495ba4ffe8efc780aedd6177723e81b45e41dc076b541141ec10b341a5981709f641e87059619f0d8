/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a8903d3b8c462b85cc34e8565e1a1084827d0a29/packages/@react-aria/calendar/src/useCalendarCell.ts
 */
import { isToday } from "@internationalized/date";
import { createMemo, splitProps } from "solid-js";
import { Polymorphic } from "../polymorphic";
import { useCalendarContext } from "./calendar-context";
import { CalendarGridBodyCellContext, } from "./calendar-grid-body-cell-context";
/**
 * A calendar grid body cell displays a date cell within a calendar grid which can be selected by the user.
 */
export function CalendarGridBodyCell(props) {
    const rootContext = useCalendarContext();
    const [local, others] = splitProps(props, ["date", "disabled"]);
    const isSelected = createMemo(() => {
        return rootContext.isCellSelected(local.date);
    });
    const isFocused = createMemo(() => {
        return rootContext.isCellFocused(local.date);
    });
    const isDisabled = createMemo(() => {
        return local.disabled || rootContext.isCellDisabled(local.date);
    });
    const isUnavailable = createMemo(() => {
        return rootContext.isCellUnavailable(local.date);
    });
    const isSelectable = () => {
        return !rootContext.isReadOnly() && !isDisabled() && !isUnavailable();
    };
    const isInvalid = createMemo(() => {
        return rootContext.validationState() === "invalid" && isSelected();
    });
    const isDateToday = () => isToday(local.date, rootContext.timeZone());
    const context = {
        date: () => local.date,
        isSelected,
        isFocused,
        isUnavailable,
        isSelectable,
        isDisabled,
        isInvalid,
        isDateToday,
    };
    return (<CalendarGridBodyCellContext.Provider value={context}>
      <Polymorphic as="td" role="gridcell" aria-disabled={!isSelectable() || undefined} aria-selected={isSelected() || undefined} aria-invalid={isInvalid() || undefined} aria-current={isDateToday() ? "date" : undefined} data-value={local.date.toString()} {...others}/>
    </CalendarGridBodyCellContext.Provider>);
}
