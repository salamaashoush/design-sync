/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-aria/calendar/src/useCalendarGrid.ts
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/react-aria-components/src/Calendar.tsx
 */
import { Index, splitProps } from "solid-js";
import { Polymorphic } from "../polymorphic";
import { useCalendarGridContext } from "./calendar-grid-context";
/**
 * A calendar grid header row displays week day names inside a `Calendar.GridHeader`.
 */
export function CalendarGridHeaderRow(props) {
    const [local, others] = splitProps(props, ["children"]);
    const context = useCalendarGridContext();
    return (<Polymorphic as="tr" {...others}>
      <Index each={context.weekDays()}>{local.children}</Index>
    </Polymorphic>);
}
