/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/950d45db36e63851f411ed0dc6a5aad0af57da68/packages/@react-types/datepicker/src/index.d.ts
 */
import { Calendar, DateDuration } from "@internationalized/date";
import { OverrideComponentProps, ValidationState } from "@kobalte/utils";
import { JSX } from "solid-js";
import { CalendarMultipleSelectionOptions, CalendarRangeSelectionOptions, CalendarSingleSelectionOptions } from "../calendar/calendar-root";
import { DateValue } from "../calendar/types";
import { AsChildProp } from "../polymorphic";
import { PopperRootOptions } from "../popper";
import { DateFieldGranularity, DateFieldHourCycle, DateFieldMaxGranularity } from "./types";
export type DatePickerRootOptions = (CalendarSingleSelectionOptions | CalendarMultipleSelectionOptions | CalendarRangeSelectionOptions) & Omit<PopperRootOptions, "anchorRef" | "contentRef" | "onCurrentPlacementChange"> & AsChildProp & {
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
    /** The controlled open state of the date picker. */
    open?: boolean;
    /**
     * The default open state when initially rendered.
     * Useful when you do not need to control the open state.
     */
    defaultOpen?: boolean;
    /** Event handler called when the open state of the date picker changes. */
    onOpenChange?: (isOpen: boolean) => void;
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
    /** Whether the date picker should close automatically when a date is selected. */
    closeOnSelect?: boolean;
    /**
     * A placeholder date that influences the format of the placeholder shown when no value is selected.
     * Defaults to today's date at midnight.
     */
    placeholderValue?: DateValue;
    /**
     * Whether to display the time in 12 or 24-hour format.
     * By default, this is determined by the user's locale.
     */
    hourCycle?: DateFieldHourCycle;
    /**
     * Determines the smallest unit that is displayed in the date field.
     * By default, this is `"day"` for dates, and `"minute"` for times.
     */
    granularity?: DateFieldGranularity;
    /** Determines the largest unit that is displayed in the date field. */
    maxGranularity?: DateFieldMaxGranularity;
    /** Whether to hide the time zone abbreviation. */
    hideTimeZone?: boolean;
    /**
     * Whether to always show leading zeros in the hour field.
     * By default, this is determined by the user's locale.
     */
    shouldForceLeadingZeros?: boolean;
    /**
     * Whether the date picker should be the only visible content for screen readers.
     * When set to `true`:
     * - interaction with outside elements will be disabled.
     * - scroll will be locked.
     * - focus will be locked inside the select content.
     * - elements outside the date picker content will not be visible for screen readers.
     */
    modal?: boolean;
    /**
     * Used to force mounting the date picker (portal, positioner and content) when more control is needed.
     * Useful when controlling animation with SolidJS animation libraries.
     */
    forceMount?: boolean;
    /**
     * A unique identifier for the component.
     * The id is used to generate id attributes for nested components.
     * If no id prop is provided, a generated id will be used.
     */
    id?: string;
    /**
     * The name of the date picker.
     * Submitted with its owning form as part of a name/value pair.
     */
    name?: string;
    /** Whether the date picker should display its "valid" or "invalid" visual styling. */
    validationState?: ValidationState;
    /** Whether the user must select a date before the owning form can be submitted. */
    required?: boolean;
    /** Whether the date picker is disabled. */
    disabled?: boolean;
    /** Whether the date picker is read only. */
    readOnly?: boolean;
    /** The children of the date picker. */
    children?: JSX.Element;
};
export type DatePickerRootProps = OverrideComponentProps<"div", DatePickerRootOptions>;
/**
 * A date picker combines a `DateField` and a `Calendar` popover to allow users to enter or select a date and time value.
 */
export declare function DatePickerRoot(props: DatePickerRootProps): JSX.Element;
