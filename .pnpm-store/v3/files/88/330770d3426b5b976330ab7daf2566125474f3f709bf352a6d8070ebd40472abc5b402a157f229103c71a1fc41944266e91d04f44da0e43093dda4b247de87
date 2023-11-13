/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a8903d3b8c462b85cc34e8565e1a1084827d0a29/packages/@react-aria/calendar/src/useCalendarCell.ts
 */
import { OverrideComponentProps } from "@kobalte/utils";
import { DateValue } from "./types";
export interface CalendarGridBodyCellOptions {
    /** The date that this cell represents. */
    date: DateValue;
    /**
     * Whether the cell is disabled. By default, this is determined by the
     * Calendar's `minValue`, `maxValue`, and `isDisabled` props.
     */
    disabled?: boolean;
}
export type CalendarGridBodyCellProps = OverrideComponentProps<"td", CalendarGridBodyCellOptions>;
/**
 * A calendar grid body cell displays a date cell within a calendar grid which can be selected by the user.
 */
export declare function CalendarGridBodyCell(props: CalendarGridBodyCellProps): import("solid-js").JSX.Element;
