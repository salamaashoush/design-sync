/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-stately/calendar/src/utils.ts
 *
 * Portions of this file are based on code from zag, based on code from react-spectrum.
 * MIT Licensed, Copyright (c) 2021 Chakra UI.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/zag/blob/main/packages/utilities/date-utils/src/pagination.ts
 */
import { CalendarDate, DateDuration } from "@internationalized/date";
import { RangeValue } from "@kobalte/utils";
import { LocalizedMessageFormatter } from "../i18n";
import { CalendarSelectionMode, DateAlignment, DateValue } from "./types";
export declare function constrainStart(date: DateValue, aligned: DateValue, duration: DateDuration, locale: string, min?: DateValue, max?: DateValue): DateValue;
export declare function constrainValue(date: DateValue, min?: DateValue, max?: DateValue): DateValue;
export declare function alignStart(date: DateValue, duration: DateDuration, locale: string, min?: DateValue, max?: DateValue): DateValue;
export declare function alignCenter(date: DateValue, duration: DateDuration, locale: string, min?: DateValue, max?: DateValue): DateValue;
export declare function alignEnd(date: DateValue, duration: DateDuration, locale: string, min?: DateValue, max?: DateValue): DateValue;
export declare function alignDate(date: DateValue, alignment: DateAlignment, duration: DateDuration, locale: string, min?: DateValue | undefined, max?: DateValue | undefined): DateValue;
export declare function alignStartDate(date: DateValue, startDate: DateValue, endDate: DateValue, duration: DateDuration, locale: string, min?: DateValue | undefined, max?: DateValue | undefined): DateValue;
export declare function isDateInvalid(date?: DateValue | null, minValue?: DateValue | null, maxValue?: DateValue | null): boolean;
export declare function isPreviousVisibleRangeInvalid(startDate: DateValue, min?: DateValue | null, max?: DateValue | null): boolean;
export declare function isNextVisibleRangeInvalid(endDate: DateValue, min?: DateValue | null, max?: DateValue | null): boolean;
export declare function getEndDate(startDate: DateValue, duration: DateDuration): CalendarDate | import("@internationalized/date").CalendarDateTime | import("@internationalized/date").ZonedDateTime;
export declare function getAdjustedDateFn(visibleDuration: DateDuration, locale: string, min?: DateValue, max?: DateValue): (options: {
    startDate: DateValue;
    focusedDate: DateValue;
}) => {
    startDate: DateValue;
    endDate: CalendarDate | import("@internationalized/date").CalendarDateTime | import("@internationalized/date").ZonedDateTime;
    focusedDate: DateValue;
};
export declare function getUnitDuration(duration: DateDuration): {
    years?: number;
    months?: number;
    weeks?: number;
    days?: number;
};
export declare function getNextUnavailableDate(anchorDate: DateValue, start: DateValue, end: DateValue, isDateUnavailableFn: (date: DateValue) => boolean, dir: number): DateValue | undefined;
export declare function getPreviousAvailableDate(date: DateValue, min: DateValue, isDateUnavailable?: (date: DateValue) => boolean): DateValue;
export declare function getEraFormat(date: DateValue): "short" | undefined;
/** Return the first value of the selection depending on the selection mode. */
export declare function getFirstValueOfSelection(selectionMode: CalendarSelectionMode, value: DateValue | DateValue[] | RangeValue<DateValue> | null | undefined): DateValue;
/** Return an array of values for the selection depending on the selection mode. */
export declare function getArrayValueOfSelection(selectionMode: CalendarSelectionMode, value: DateValue | DateValue[] | RangeValue<DateValue> | null | undefined): DateValue[];
export declare function getSelectedDateDescription(messageFormatter: LocalizedMessageFormatter, value: DateValue, timeZone: string): string;
export declare function getSelectedDateRangeDescription(messageFormatter: LocalizedMessageFormatter, highlightedRange: {
    start?: DateValue;
    end?: DateValue;
}, anchorDate: DateValue | undefined, timeZone: string): string;
export declare function getVisibleRangeDescription(messageFormatter: LocalizedMessageFormatter, startDate: DateValue, endDate: DateValue, timeZone: string, isAria: boolean): string;
export declare function getNextPage(focusedDate: DateValue, startDate: DateValue, visibleDuration: DateDuration, locale: string, min?: DateValue, max?: DateValue): {
    startDate: DateValue;
    endDate: CalendarDate | import("@internationalized/date").CalendarDateTime | import("@internationalized/date").ZonedDateTime;
    focusedDate: DateValue;
};
export declare function getPreviousPage(focusedDate: DateValue, startDate: DateValue, visibleDuration: DateDuration, locale: string, min?: DateValue, max?: DateValue): {
    startDate: DateValue;
    endDate: CalendarDate | import("@internationalized/date").CalendarDateTime | import("@internationalized/date").ZonedDateTime;
    focusedDate: DateValue;
};
export declare function getNextRow(focusedDate: DateValue, startDate: DateValue, visibleDuration: DateDuration, locale: string, min?: DateValue, max?: DateValue): {
    startDate: DateValue;
    endDate: CalendarDate | import("@internationalized/date").CalendarDateTime | import("@internationalized/date").ZonedDateTime;
    focusedDate: DateValue;
};
export declare function getPreviousRow(focusedDate: DateValue, startDate: DateValue, visibleDuration: DateDuration, locale: string, min?: DateValue, max?: DateValue): {
    startDate: DateValue;
    endDate: CalendarDate | import("@internationalized/date").CalendarDateTime | import("@internationalized/date").ZonedDateTime;
    focusedDate: DateValue;
};
export declare function getSectionStart(focusedDate: DateValue, startDate: DateValue, visibleDuration: DateDuration, locale: string, min?: DateValue, max?: DateValue): {
    startDate: DateValue;
    endDate: CalendarDate | import("@internationalized/date").CalendarDateTime | import("@internationalized/date").ZonedDateTime;
    focusedDate: DateValue;
};
export declare function getSectionEnd(focusedDate: DateValue, startDate: DateValue, visibleDuration: DateDuration, locale: string, min?: DateValue, max?: DateValue): {
    startDate: DateValue;
    endDate: CalendarDate | import("@internationalized/date").CalendarDateTime | import("@internationalized/date").ZonedDateTime;
    focusedDate: DateValue;
};
export declare function getNextSection(focusedDate: DateValue, startDate: DateValue, larger: boolean, visibleDuration: DateDuration, locale: string, min?: DateValue, max?: DateValue): {
    startDate: DateValue;
    endDate: CalendarDate | import("@internationalized/date").CalendarDateTime | import("@internationalized/date").ZonedDateTime;
    focusedDate: DateValue;
};
export declare function getPreviousSection(focusedDate: DateValue, startDate: DateValue, larger: boolean, visibleDuration: DateDuration, locale: string, min?: DateValue, max?: DateValue): {
    startDate: DateValue;
    endDate: CalendarDate | import("@internationalized/date").CalendarDateTime | import("@internationalized/date").ZonedDateTime;
    focusedDate: DateValue;
};
/** Narrow the type of `value` to `DateValue`. */
export declare function asSingleValue(value: DateValue | DateValue[] | RangeValue<DateValue> | null | undefined): DateValue;
/** Narrow the type of `value` to `DateValue[]`. */
export declare function asArrayValue(value: DateValue | DateValue[] | RangeValue<DateValue> | null | undefined): DateValue[];
/** Narrow the type of `value` to `RangeValue<DateValue>`. */
export declare function asRangeValue(value: DateValue | DateValue[] | RangeValue<DateValue> | null | undefined): RangeValue<DateValue>;
export declare function sortDates(values: DateValue[]): DateValue[];
export declare function makeCalendarDateRange(start?: DateValue, end?: DateValue): RangeValue<CalendarDate> | undefined;
