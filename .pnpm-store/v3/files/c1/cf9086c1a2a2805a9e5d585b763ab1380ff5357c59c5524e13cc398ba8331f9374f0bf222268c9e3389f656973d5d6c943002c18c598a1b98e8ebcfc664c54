/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-stately/calendar/src/useCalendarState.ts
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-aria/calendar/src/useCalendarBase.ts
 */
import { DateFormatter, getDayOfWeek, GregorianCalendar, isSameDay, maxDate, minDate, startOfWeek, toCalendar, toCalendarDate, today, } from "@internationalized/date";
import { contains, getDocument, getWindow, mergeDefaultProps, mergeRefs, } from "@kobalte/utils";
import { createEffect, createMemo, createSignal, on, onCleanup, splitProps, } from "solid-js";
import { createMessageFormatter, getReadingDirection, useLocale } from "../i18n";
import { announce } from "../live-announcer";
import { Polymorphic } from "../polymorphic";
import { createControllableSignal, createInteractOutside } from "../primitives";
import { CALENDAR_INTL_MESSAGES } from "./calendar.intl";
import { CalendarContext } from "./calendar-context";
import { alignCenter, alignDate, asArrayValue, asRangeValue, asSingleValue, constrainValue, getAdjustedDateFn, getArrayValueOfSelection, getEndDate, getFirstValueOfSelection, getNextPage, getNextRow, getNextSection, getNextUnavailableDate, getPreviousAvailableDate, getPreviousPage, getPreviousRow, getPreviousSection, getSectionEnd, getSectionStart, getSelectedDateDescription, getSelectedDateRangeDescription, getVisibleRangeDescription, isDateInvalid, makeCalendarDateRange, sortDates, } from "./utils";
import { isServer } from "solid-js/web";
/**
 * A calendar displays one or more date grids and allows users to select a single, multiple or range of dates.
 */
export function CalendarRoot(props) {
    let ref;
    props = mergeDefaultProps({
        visibleDuration: { months: 1 },
        selectionMode: "single",
    }, props);
    const [local, others] = splitProps(props, [
        "ref",
        "locale",
        "createCalendar",
        "visibleDuration",
        "selectionAlignment",
        "selectionMode",
        "value",
        "defaultValue",
        "onChange",
        "minValue",
        "maxValue",
        "isDateUnavailable",
        "allowsNonContiguousRanges",
        "autoFocus",
        "focusedValue",
        "defaultFocusedValue",
        "onFocusChange",
        "validationState",
        "disabled",
        "readOnly",
        "aria-label",
    ]);
    const messageFormatter = createMessageFormatter(() => CALENDAR_INTL_MESSAGES);
    const locale = createMemo(() => {
        return local.locale ?? useLocale().locale();
    });
    const resolvedOptions = createMemo(() => {
        return new DateFormatter(locale()).resolvedOptions();
    });
    const direction = createMemo(() => {
        return getReadingDirection(locale());
    });
    const calendar = createMemo(() => {
        return local.createCalendar(resolvedOptions().calendar);
    });
    const [value, setControlledValue] = createControllableSignal({
        value: () => local.value,
        defaultValue: () => local.defaultValue,
        onChange: value => local.onChange?.(value),
    });
    const [availableRange, setAvailableRange] = createSignal();
    const selectionAlignment = createMemo(() => {
        if (local.selectionMode === "range") {
            const valueRange = asRangeValue(value());
            if (valueRange?.start && valueRange.end) {
                const start = alignCenter(toCalendarDate(valueRange.start), local.visibleDuration, locale(), local.minValue, local.maxValue);
                const end = start.add(local.visibleDuration).subtract({ days: 1 });
                if (valueRange.end.compare(end) > 0) {
                    return "start";
                }
            }
            return "center";
        }
        return local.selectionAlignment ?? "center";
    });
    const min = createMemo(() => {
        const startRange = availableRange()?.start;
        if (local.selectionMode === "range" && local.minValue && startRange) {
            return maxDate(local.minValue, startRange);
        }
        return local.minValue;
    });
    const max = createMemo(() => {
        const endRange = availableRange()?.end;
        if (local.selectionMode === "range" && local.maxValue && endRange) {
            return minDate(local.maxValue, endRange);
        }
        return local.maxValue;
    });
    const calendarDateValue = createMemo(() => {
        return getArrayValueOfSelection(local.selectionMode, value()).map(date => toCalendar(toCalendarDate(date), calendar()));
    });
    const timeZone = createMemo(() => {
        const firstValue = getFirstValueOfSelection(local.selectionMode, value());
        if (firstValue && "timeZone" in firstValue) {
            return firstValue.timeZone;
        }
        return resolvedOptions().timeZone;
    });
    const focusedCalendarDate = createMemo(() => {
        if (local.focusedValue) {
            return constrainValue(toCalendar(toCalendarDate(local.focusedValue), calendar()), min(), max());
        }
        return undefined;
    });
    const defaultFocusedCalendarDate = createMemo(() => {
        return constrainValue(local.defaultFocusedValue
            ? toCalendar(toCalendarDate(local.defaultFocusedValue), calendar())
            : calendarDateValue()[0] || toCalendar(today(timeZone()), calendar()), min(), max());
    });
    const [focusedDate, setFocusedDate] = createControllableSignal({
        value: focusedCalendarDate,
        defaultValue: defaultFocusedCalendarDate,
        onChange: value => local.onFocusChange?.(value),
    });
    const [startDate, setStartDate] = createSignal(alignDate(focusedDate(), selectionAlignment(), local.visibleDuration, locale(), min(), max()));
    const endDate = createMemo(() => {
        return getEndDate(startDate(), local.visibleDuration);
    });
    const [isFocused, setIsFocused] = createSignal(local.autoFocus || false);
    const [isDragging, setIsDragging] = createSignal(false);
    const visibleRangeDescription = createMemo(() => {
        return getVisibleRangeDescription(messageFormatter(), startDate(), endDate(), timeZone(), true);
    });
    const ariaLabel = () => {
        return [local["aria-label"], visibleRangeDescription()].filter(Boolean).join(", ");
    };
    const isCellDisabled = (date) => {
        return (local.disabled ||
            date.compare(startDate()) < 0 ||
            date.compare(endDate()) > 0 ||
            isDateInvalid(date, min(), max()));
    };
    const isCellUnavailable = (date) => {
        return local.isDateUnavailable?.(date) ?? false;
    };
    const updateAvailableRange = (date) => {
        if (date && local.isDateUnavailable && !local.allowsNonContiguousRanges) {
            setAvailableRange({
                start: getNextUnavailableDate(date, startDate(), endDate(), isCellUnavailable, -1),
                end: getNextUnavailableDate(date, startDate(), endDate(), isCellUnavailable, 1),
            });
        }
        else {
            setAvailableRange(undefined);
        }
    };
    const [anchorDate, setAnchorDate] = createControllableSignal({
        onChange: value => updateAvailableRange(value),
    });
    const highlightedRange = createMemo(() => {
        if (local.selectionMode !== "range") {
            return undefined;
        }
        const resolvedAnchorDate = anchorDate();
        if (resolvedAnchorDate) {
            return makeCalendarDateRange(resolvedAnchorDate, focusedDate());
        }
        const { start, end } = asRangeValue(value()) ?? {};
        return makeCalendarDateRange(start, end);
    });
    const validationState = createMemo(() => {
        if (local.validationState) {
            return local.validationState;
        }
        if (calendarDateValue().length <= 0) {
            return null;
        }
        if (local.selectionMode === "range" && anchorDate()) {
            return null;
        }
        const isSomeDateInvalid = calendarDateValue().some(date => {
            return local.isDateUnavailable?.(date) || isDateInvalid(date, min(), max());
        });
        return isSomeDateInvalid ? "invalid" : null;
    });
    const isCellSelected = (cellDate) => {
        const isAvailable = !isCellDisabled(cellDate) && !isCellUnavailable(cellDate);
        if (local.selectionMode === "range") {
            const { start, end } = highlightedRange() ?? {};
            const isInRange = start != null && cellDate.compare(start) >= 0 && end != null && cellDate.compare(end) <= 0;
            return isInRange && isAvailable;
        }
        return calendarDateValue().some(date => isSameDay(cellDate, date)) && isAvailable;
    };
    const isCellFocused = (date) => {
        const resolvedFocusedDate = focusedDate();
        return isFocused() && resolvedFocusedDate != null && isSameDay(date, resolvedFocusedDate);
    };
    const isCellInvalid = (date) => {
        if (local.selectionMode === "range") {
            return (isDateInvalid(date, min(), max()) ||
                isDateInvalid(date, availableRange()?.start, availableRange()?.end));
        }
        return isDateInvalid(date, min(), max());
    };
    const selectDate = (date) => {
        if (local.readOnly || local.disabled) {
            return;
        }
        let newValue = getPreviousAvailableDate(constrainValue(date, min(), max()), startDate(), local.isDateUnavailable);
        if (!newValue) {
            return;
        }
        if (local.selectionMode === "single") {
            setControlledValue(prev => {
                const prevValue = asSingleValue(prev);
                if (!newValue) {
                    return prevValue;
                }
                return convertValue(newValue, prevValue);
            });
        }
        else if (local.selectionMode === "multiple") {
            setControlledValue(prev => {
                const prevValue = asArrayValue(prev) ?? [];
                if (!newValue) {
                    return prevValue;
                }
                newValue = convertValue(newValue, prevValue[0]);
                const index = prevValue.findIndex(date => newValue != null && isSameDay(date, newValue));
                // If new value is already selected, remove it.
                if (index !== -1) {
                    const nextValues = [...prevValue];
                    nextValues.splice(index, 1);
                    return sortDates(nextValues);
                }
                else {
                    return sortDates([...prevValue, newValue]);
                }
            });
        }
        else if (local.selectionMode === "range") {
            if (!anchorDate()) {
                setAnchorDate(newValue);
            }
            else {
                setControlledValue(prev => {
                    const prevRange = asRangeValue(prev);
                    const range = makeCalendarDateRange(anchorDate(), newValue);
                    if (!range) {
                        return prevRange;
                    }
                    return {
                        start: convertValue(range.start, prevRange?.start),
                        end: convertValue(range.end, prevRange?.end),
                    };
                });
                setAnchorDate(undefined);
            }
        }
    };
    const selectFocusedDate = () => {
        selectDate(focusedDate());
    };
    const focusCell = (date) => {
        setFocusedDate(constrainValue(date, min(), max()));
        if (!isFocused()) {
            setIsFocused(true);
        }
    };
    const highlightDate = (date) => {
        if (anchorDate()) {
            focusCell(date);
        }
    };
    const focusNextDay = () => {
        focusCell(focusedDate().add({ days: 1 }));
    };
    const focusPreviousDay = () => {
        focusCell(focusedDate().subtract({ days: 1 }));
    };
    const focusNextRow = () => {
        const row = getNextRow(focusedDate(), startDate(), local.visibleDuration, locale(), min(), max());
        if (row) {
            setStartDate(row.startDate);
            focusCell(row.focusedDate);
        }
    };
    const focusPreviousRow = () => {
        const row = getPreviousRow(focusedDate(), startDate(), local.visibleDuration, locale(), min(), max());
        if (row) {
            setStartDate(row.startDate);
            focusCell(row.focusedDate);
        }
    };
    const focusNextPage = () => {
        const page = getNextPage(focusedDate(), startDate(), local.visibleDuration, locale(), min(), max());
        setFocusedDate(constrainValue(page.focusedDate, min(), max()));
        setStartDate(page.startDate);
    };
    const focusPreviousPage = () => {
        const page = getPreviousPage(focusedDate(), startDate(), local.visibleDuration, locale(), min(), max());
        setFocusedDate(constrainValue(page.focusedDate, min(), max()));
        setStartDate(page.startDate);
    };
    const focusSectionStart = () => {
        const section = getSectionStart(focusedDate(), startDate(), local.visibleDuration, locale(), min(), max());
        if (section) {
            setStartDate(section.startDate);
            focusCell(section.focusedDate);
        }
    };
    const focusSectionEnd = () => {
        const section = getSectionEnd(focusedDate(), startDate(), local.visibleDuration, locale(), min(), max());
        if (section) {
            setStartDate(section.startDate);
            focusCell(section.focusedDate);
        }
    };
    const focusNextSection = (larger) => {
        const section = getNextSection(focusedDate(), startDate(), larger, local.visibleDuration, locale(), min(), max());
        if (section) {
            setStartDate(section.startDate);
            focusCell(section.focusedDate);
        }
    };
    const focusPreviousSection = (larger) => {
        const section = getPreviousSection(focusedDate(), startDate(), larger, local.visibleDuration, locale(), min(), max());
        if (section) {
            setStartDate(section.startDate);
            focusCell(section.focusedDate);
        }
    };
    const getDatesInWeek = (weekIndex, from) => {
        let date = from.add({ weeks: weekIndex });
        const dates = [];
        date = startOfWeek(date, locale());
        // startOfWeek will clamp dates within the calendar system's valid range, which may
        // start in the middle of a week. In this case, add null placeholders.
        const dayOfWeek = getDayOfWeek(date, locale());
        for (let i = 0; i < dayOfWeek; i++) {
            dates.push(null);
        }
        while (dates.length < 7) {
            dates.push(date);
            const nextDate = date.add({ days: 1 });
            if (isSameDay(date, nextDate)) {
                // If the next day is the same, we have hit the end of the calendar system.
                break;
            }
            date = nextDate;
        }
        // Add null placeholders if at the end of the calendar system.
        while (dates.length < 7) {
            dates.push(null);
        }
        return dates;
    };
    createInteractOutside({
        onInteractOutside: e => {
            // Stop range selection on interaction outside the calendar, e.g. tabbing away from the calendar.
            if (local.selectionMode === "range" && anchorDate()) {
                selectFocusedDate();
            }
        },
    }, () => ref);
    // Reset focused date and visible range when calendar changes.
    let lastCalendarIdentifier = calendar().identifier;
    createEffect(on(calendar, calendar => {
        if (calendar.identifier !== lastCalendarIdentifier) {
            const newFocusedDate = toCalendar(focusedDate(), calendar);
            setStartDate(alignCenter(newFocusedDate, local.visibleDuration, locale(), min(), max()));
            setFocusedDate(newFocusedDate);
            lastCalendarIdentifier = calendar.identifier;
        }
    }));
    createEffect(() => {
        const adjust = getAdjustedDateFn(local.visibleDuration, locale(), min(), max());
        const adjustment = adjust({
            startDate: startDate(),
            focusedDate: focusedDate(),
        });
        setStartDate(adjustment.startDate);
        setFocusedDate(adjustment.focusedDate);
    });
    // Announce when the visible date range changes only when pressing the Previous or Next triggers.
    createEffect(() => {
        if (!isFocused()) {
            announce(visibleRangeDescription());
        }
    });
    // Announce when the selected value changes
    createEffect(() => {
        let description;
        if (local.selectionMode === "single") {
            const date = asSingleValue(value());
            description = date && getSelectedDateDescription(messageFormatter(), date, timeZone());
        }
        else if (local.selectionMode === "multiple") {
            const dates = asArrayValue(value());
            description = dates
                ?.map(date => getSelectedDateDescription(messageFormatter(), date, timeZone()))
                .join(", ");
        }
        else if (local.selectionMode === "range") {
            const dateRange = asRangeValue(value()) ?? {};
            description = getSelectedDateRangeDescription(messageFormatter(), dateRange, anchorDate(), timeZone());
        }
        if (description) {
            announce(description, "polite", 4000);
        }
    });
    // In "range" selection mode, update the available range if the visible range changes.
    createEffect(on([startDate, endDate], () => {
        if (local.selectionMode === "range") {
            updateAvailableRange(anchorDate());
        }
    }));
    let isVirtualClick = false;
    createEffect(() => {
        if (isServer) {
            return;
        }
        if (local.selectionMode !== "range" || !ref) {
            return;
        }
        const win = getWindow(ref);
        const doc = getDocument(ref);
        // We need to ignore virtual pointer events from VoiceOver due to these bugs.
        // https://bugs.webkit.org/show_bug.cgi?id=222627
        // https://bugs.webkit.org/show_bug.cgi?id=223202
        const onWindowPointerDown = (e) => {
            isVirtualClick = e.width === 0 && e.height === 0;
        };
        // Stop range selection when pressing or releasing a pointer outside the calendar body,
        // except when pressing the next or previous buttons to switch months.
        const endDragging = (e) => {
            if (isVirtualClick) {
                isVirtualClick = false;
                return;
            }
            setIsDragging(false);
            if (!anchorDate()) {
                return;
            }
            const target = e.target;
            if (contains(ref, doc.activeElement) &&
                (!contains(ref, target) || !target.closest('button, [role="button"]'))) {
                selectFocusedDate();
            }
        };
        // Prevent touch scrolling while dragging
        const onTouchMove = (e) => {
            if (isDragging()) {
                e.preventDefault();
            }
        };
        win.addEventListener("pointerdown", onWindowPointerDown);
        win.addEventListener("pointerup", endDragging);
        win.addEventListener("pointercancel", endDragging);
        ref.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
        onCleanup(() => {
            win.removeEventListener("pointerdown", onWindowPointerDown);
            win.removeEventListener("pointerup", endDragging);
            win.removeEventListener("pointercancel", endDragging);
            ref?.removeEventListener("touchmove", onTouchMove, { capture: true });
        });
    });
    const dataset = createMemo(() => ({}));
    const context = {
        dataset,
        value,
        isDisabled: () => local.disabled ?? false,
        isReadOnly: () => local.readOnly ?? false,
        isDragging,
        isCellUnavailable,
        isCellDisabled,
        isCellSelected,
        isCellFocused,
        isCellInvalid,
        validationState,
        startDate,
        endDate,
        anchorDate,
        focusedDate: () => focusedDate(),
        visibleDuration: () => local.visibleDuration,
        selectionMode: () => local.selectionMode,
        locale,
        highlightedRange,
        direction,
        min,
        max,
        timeZone,
        messageFormatter,
        setStartDate,
        setAnchorDate,
        setIsFocused,
        setIsDragging,
        selectFocusedDate,
        selectDate,
        highlightDate,
        focusCell,
        focusNextDay,
        focusPreviousDay,
        focusNextPage,
        focusPreviousPage,
        focusNextRow,
        focusPreviousRow,
        focusSectionStart,
        focusSectionEnd,
        focusNextSection,
        focusPreviousSection,
        getDatesInWeek,
    };
    return (<CalendarContext.Provider value={context}>
      <Polymorphic ref={mergeRefs(el => (ref = el), local.ref)} as="div" role="group" aria-label={ariaLabel()} {...others}/>
    </CalendarContext.Provider>);
}
function convertValue(newValue, oldValue) {
    // The display calendar should not have any effect on the emitted value.
    // Emit dates in the same calendar as the original value, if any, otherwise gregorian.
    newValue = toCalendar(newValue, oldValue?.calendar || new GregorianCalendar());
    // Preserve time if the input value had one.
    if (oldValue && "hour" in oldValue) {
        return oldValue.set(newValue);
    }
    return newValue;
}
