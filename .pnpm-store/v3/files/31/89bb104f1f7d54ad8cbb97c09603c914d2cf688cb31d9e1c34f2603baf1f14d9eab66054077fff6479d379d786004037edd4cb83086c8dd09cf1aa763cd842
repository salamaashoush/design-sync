import { getWeeksInMonth } from "@internationalized/date";
import { createMemo, Index, splitProps } from "solid-js";
import { Polymorphic } from "../polymorphic";
import { useCalendarContext } from "./calendar-context";
import { useCalendarGridContext } from "./calendar-grid-context";
/**
 * A calendar grid body displays a grid of calendar cells within a month.
 */
export function CalendarGridBody(props) {
    const rootContext = useCalendarContext();
    const context = useCalendarGridContext();
    const [local, others] = splitProps(props, ["children"]);
    const weekIndexes = createMemo(() => {
        const weeksInMonth = getWeeksInMonth(context.startDate(), rootContext.locale());
        return [...new Array(weeksInMonth).keys()];
    });
    return (<Polymorphic as="tbody" {...others}>
      <Index each={weekIndexes()}>{local.children}</Index>
    </Polymorphic>);
}
