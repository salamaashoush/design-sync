/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-aria/calendar/src/useCalendarGrid.ts
 */
import { DateDuration } from "@internationalized/date";
import { OverrideComponentProps } from "@kobalte/utils";
import { JSX } from "solid-js";
export interface CalendarGridOptions {
    /**
     * An offset from the beginning of the visible date range that this grid should display.
     * Useful when displaying more than one month at a time.
     */
    offset?: DateDuration;
    /**
     * The format of weekday names to display in the `Calendar.GridHeader`
     * e.g. single letter, abbreviation, or full day name.
     */
    weekDayFormat?: "narrow" | "short" | "long";
}
export type CalendarGridProps = OverrideComponentProps<"table", CalendarGridOptions>;
/**
 * A calendar grid displays a single grid of days within a calendar or range calendar which
 * can be keyboard navigated and selected by the user.
 */
export declare function CalendarGrid(props: CalendarGridProps): JSX.Element;
