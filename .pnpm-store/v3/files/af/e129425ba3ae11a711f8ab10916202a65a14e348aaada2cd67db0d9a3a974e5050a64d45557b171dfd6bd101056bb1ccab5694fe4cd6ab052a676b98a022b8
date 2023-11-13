import { Calendar, type ResolvedDateTimeFormatOptions } from "@internationalized/date";
import { Accessor } from "solid-js";
import { DateFieldOptions, DateSegment, SegmentType } from "./types";
export interface DatePickerInputContextValue {
    calendar: Accessor<Calendar>;
    dateValue: Accessor<Date | undefined>;
    dateFormatterResolvedOptions: Accessor<ResolvedDateTimeFormatOptions>;
    segments: Accessor<DateSegment[]>;
    ariaLabel: Accessor<string | undefined>;
    ariaLabelledBy: Accessor<string | undefined>;
    ariaDescribedBy: Accessor<string | undefined>;
    increment(type: SegmentType): void;
    decrement(type: SegmentType): void;
    incrementPage(type: SegmentType): void;
    decrementPage(type: SegmentType): void;
    setSegment(type: SegmentType, value: number): void;
    clearSegment(type: SegmentType): void;
    formatValue(fieldOptions: DateFieldOptions): string;
}
export declare const DatePickerInputContext: import("solid-js").Context<DatePickerInputContextValue>;
export declare function useDatePickerInputContext(): DatePickerInputContextValue;
