import { OverrideComponentProps } from "@kobalte/utils";
import { Accessor, JSX } from "solid-js";
import { DateValue } from "./types";
export interface CalendarGridBodyRowOptions {
    /** The index of the week to render. */
    weekIndex: number;
    /**
     * Render prop used to render each cell of the week row,
     * it receives a date accessor as parameter.
     */
    children: (date: Accessor<DateValue | null>) => JSX.Element;
}
export type CalendarGridBodyRowProps = OverrideComponentProps<"tr", CalendarGridBodyRowOptions>;
/**
 * A calendar grid body row displays a row of calendar cells within a month.
 */
export declare function CalendarGridBodyRow(props: CalendarGridBodyRowProps): JSX.Element;
