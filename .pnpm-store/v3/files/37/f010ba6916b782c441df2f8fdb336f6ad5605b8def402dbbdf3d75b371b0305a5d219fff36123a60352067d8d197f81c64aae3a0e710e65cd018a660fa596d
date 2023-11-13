/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-stately/calendar/src/useCalendarState.ts
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-aria/calendar/src/useCalendarBase.ts
 */
import { Calendar, DateDuration } from "@internationalized/date";
import { OverrideComponentProps, RangeValue, ValidationState } from "@kobalte/utils";
import { AsChildProp } from "../polymorphic";
import { DateAlignment, DateValue } from "./types";
export interface CalendarSingleSelectionOptions {
    /** The selection mode of the calendar. */
    selectionMode: "single";
    /** The controlled selected date of the calendar. */
    value?: DateValue | null;
    /**
     * The date of the calendar that should be selected when initially rendered.
     * Useful when you do not need to control the state of the calendar.
     */
    defaultValue?: DateValue | null;
    /** Event handler called when the selected date change. */
    onChange?: (value: DateValue) => void;
}
export interface CalendarMultipleSelectionOptions {
    /** The selection mode of the calendar. */
    selectionMode: "multiple";
    /** The controlled selected dates of the calendar. */
    value?: DateValue[] | null;
    /**
     * The dates of the calendar that should be selected when initially rendered.
     * Useful when you do not need to control the state of the calendar.
     */
    defaultValue?: DateValue[] | null;
    /** Event handler called when the selected dates change. */
    onChange?: (value: DateValue[]) => void;
}
export interface CalendarRangeSelectionOptions {
    /** The selection mode of the calendar. */
    selectionMode: "range";
    /** The controlled selected date range of the calendar. */
    value?: RangeValue<DateValue> | null;
    /**
     * The date range of the calendar that should be selected when initially rendered.
     * Useful when you do not need to control the state of the calendar.
     */
    defaultValue?: RangeValue<DateValue> | null;
    /** Event handler called when the selected date range change. */
    onChange?: (value: RangeValue<DateValue>) => void;
}
export type CalendarRootOptions = (CalendarSingleSelectionOptions | CalendarMultipleSelectionOptions | CalendarRangeSelectionOptions) & AsChildProp & {
    /**
     * A function that creates a [Calendar](https://react-spectrum.adobe.com/internationalized/date/Calendar.html)
     * object for a given calendar identifier. Such a function may be imported from the
     * `@internationalized/date` package, or manually implemented to include support for
     * only certain calendars.
     */
    createCalendar: (name: string) => Calendar;
    /** The locale to display and edit the value according to. */
    locale?: string;
    /**
     * The amount of days that will be displayed at once.
     * This affects how pagination works.
     */
    visibleDuration?: DateDuration;
    /** Determines how to align the initial selection relative to the visible date range. */
    selectionAlignment?: DateAlignment;
    /** The minimum allowed date that a user may select. */
    minValue?: DateValue;
    /** The maximum allowed date that a user may select. */
    maxValue?: DateValue;
    /**
     * Callback that is called for each date of the calendar.
     * If it returns true, then the date is unavailable.
     */
    isDateUnavailable?: (date: DateValue) => boolean;
    /**
     * In "range" selection mode, when combined with `isDateUnavailable`,
     * determines whether non-contiguous ranges, i.e. ranges containing unavailable dates, may be selected.
     */
    allowsNonContiguousRanges?: boolean;
    /** Whether to automatically focus the calendar when it mounts. */
    autoFocus?: boolean;
    /** Controls the currently focused date within the calendar. */
    focusedValue?: DateValue;
    /** The date that is focused when the calendar first mounts. */
    defaultFocusedValue?: DateValue;
    /** Handler that is called when the focused date changes. */
    onFocusChange?: (date: DateValue) => void;
    /** Whether the current selection is valid or invalid according to application logic. */
    validationState?: ValidationState;
    /** Whether the calendar is disabled. */
    disabled?: boolean;
    /** Whether the calendar value is read only. */
    readOnly?: boolean;
};
export type CalendarRootProps = OverrideComponentProps<"div", CalendarRootOptions>;
/**
 * A calendar displays one or more date grids and allows users to select a single, multiple or range of dates.
 */
export declare function CalendarRoot(props: CalendarRootProps): import("solid-js").JSX.Element;
