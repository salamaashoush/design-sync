import { OverrideComponentProps } from "@kobalte/utils";
import { Accessor, JSX } from "solid-js";
export interface CalendarGridBodyOptions {
    /**
     * Render prop used to render each row of the calendar grid,
     * it receives a week index accessor as parameter.
     */
    children: (weekIndex: Accessor<number>) => JSX.Element;
}
export type CalendarGridBodyProps = OverrideComponentProps<"tbody", CalendarGridBodyOptions>;
/**
 * A calendar grid body displays a grid of calendar cells within a month.
 */
export declare function CalendarGridBody(props: CalendarGridBodyProps): JSX.Element;
