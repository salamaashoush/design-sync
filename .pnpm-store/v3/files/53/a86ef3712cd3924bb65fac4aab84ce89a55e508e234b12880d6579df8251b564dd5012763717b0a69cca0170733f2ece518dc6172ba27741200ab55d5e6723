/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/950d45db36e63851f411ed0dc6a5aad0af57da68/packages/@react-stately/datepicker/src/utils.ts
 */
import { now, Time, toCalendar, toCalendarDate, toCalendarDateTime, } from "@internationalized/date";
import { createEffect, createMemo } from "solid-js";
const DEFAULT_FIELD_OPTIONS = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
};
const TWO_DIGIT_FIELD_OPTIONS = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
};
export function getDateFieldFormatOptions(fieldOptions, options) {
    const defaultFieldOptions = options.shouldForceLeadingZeros
        ? TWO_DIGIT_FIELD_OPTIONS
        : DEFAULT_FIELD_OPTIONS;
    const finalFieldOptions = { ...defaultFieldOptions, ...fieldOptions };
    const granularity = options.granularity || "minute";
    const keys = Object.keys(finalFieldOptions);
    let startIdx = keys.indexOf(options.maxGranularity ?? "year");
    if (startIdx < 0) {
        startIdx = 0;
    }
    let endIdx = keys.indexOf(granularity);
    if (endIdx < 0) {
        endIdx = 2;
    }
    if (startIdx > endIdx) {
        throw new Error("maxGranularity must be greater than granularity");
    }
    const opts = keys.slice(startIdx, endIdx + 1).reduce((opts, key) => {
        // @ts-ignore
        opts[key] = finalFieldOptions[key];
        return opts;
    }, {});
    if (options.hourCycle != null) {
        opts.hour12 = options.hourCycle === 12;
    }
    opts.timeZone = options.timeZone || "UTC";
    const hasTime = granularity === "hour" || granularity === "minute" || granularity === "second";
    if (hasTime && options.timeZone && !options.hideTimeZone) {
        opts.timeZoneName = "short";
    }
    if (options.showEra && startIdx === 0) {
        opts.era = "short";
    }
    return opts;
}
export function getPlaceholderTime(placeholderValue) {
    if (placeholderValue && "hour" in placeholderValue) {
        return placeholderValue;
    }
    return new Time();
}
export function convertValue(value, calendar) {
    if (value === null) {
        return null;
    }
    if (!value) {
        return undefined;
    }
    return toCalendar(value, calendar);
}
export function createPlaceholderDate(placeholderValue, granularity, calendar, timeZone) {
    if (placeholderValue) {
        return convertValue(placeholderValue, calendar);
    }
    const date = toCalendar(now(timeZone).set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
    }), calendar);
    if (granularity === "year" || granularity === "month" || granularity === "day") {
        return toCalendarDate(date);
    }
    if (!timeZone) {
        return toCalendarDateTime(date);
    }
    return date;
}
export function createDefaultProps(props) {
    let lastValue;
    // Compute default granularity and time zone from the value.
    // If the value becomes null, keep the last value.
    const value = createMemo(() => {
        const resolvedValue = props.value();
        if (resolvedValue) {
            lastValue = resolvedValue;
        }
        return lastValue;
    });
    const defaultTimeZone = createMemo(() => {
        const resolvedValue = value();
        if (resolvedValue && "timeZone" in resolvedValue) {
            return resolvedValue.timeZone;
        }
        return undefined;
    });
    const granularity = createMemo(() => {
        const resolvedValue = value();
        return props.granularity() || (resolvedValue && "minute" in resolvedValue ? "minute" : "day");
    });
    createEffect(() => {
        const resolvedValue = value();
        const resolvedGranularity = granularity();
        // granularity must actually exist in the value if one is provided.
        if (resolvedValue && !(resolvedGranularity in resolvedValue)) {
            throw new Error("Invalid granularity " + resolvedGranularity + " for value " + resolvedValue.toString());
        }
    });
    return { granularity, defaultTimeZone };
}
