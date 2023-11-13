/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/950d45db36e63851f411ed0dc6a5aad0af57da68/packages/@react-stately/datepicker/src/utils.ts
 */
import { Calendar } from "@internationalized/date";
import { Accessor } from "solid-js";
import { DateValue, TimeValue } from "../calendar/types";
import { DateFieldGranularity, DateFieldHourCycle, DateFieldMaxGranularity, DateFieldOptions } from "./types";
export interface FormatterOptions {
    timeZone?: string;
    hideTimeZone?: boolean;
    granularity?: DateFieldGranularity;
    maxGranularity?: DateFieldMaxGranularity;
    hourCycle?: DateFieldHourCycle;
    showEra?: boolean;
    shouldForceLeadingZeros?: boolean;
}
export declare function getDateFieldFormatOptions(fieldOptions: DateFieldOptions, options: FormatterOptions): Intl.DateTimeFormatOptions;
export declare function getPlaceholderTime(placeholderValue?: DateValue): TimeValue;
export declare function convertValue(value: DateValue | null | undefined, calendar: Calendar): DateValue | null | undefined;
export declare function createPlaceholderDate(placeholderValue: DateValue | null | undefined, granularity: string, calendar: Calendar, timeZone: string): DateValue;
export declare function createDefaultProps(props: {
    value: Accessor<DateValue | undefined>;
    granularity: Accessor<DateFieldGranularity | undefined>;
}): {
    granularity: Accessor<DateFieldGranularity>;
    defaultTimeZone: Accessor<string>;
};
