import { createMemo, Index, splitProps } from "solid-js";
import { Polymorphic } from "../polymorphic";
import { useCalendarContext } from "./calendar-context";
import { useCalendarGridContext } from "./calendar-grid-context";
/**
 * A calendar grid body row displays a row of calendar cells within a month.
 */
export function CalendarGridBodyRow(props) {
    const rootContext = useCalendarContext();
    const context = useCalendarGridContext();
    const [local, others] = splitProps(props, ["weekIndex", "children"]);
    const datesInWeek = createMemo(() => {
        return rootContext.getDatesInWeek(local.weekIndex, context.startDate());
    });
    return (<Polymorphic as="tr" {...others}>
      <Index each={datesInWeek()}>{local.children}</Index>
    </Polymorphic>);
}
