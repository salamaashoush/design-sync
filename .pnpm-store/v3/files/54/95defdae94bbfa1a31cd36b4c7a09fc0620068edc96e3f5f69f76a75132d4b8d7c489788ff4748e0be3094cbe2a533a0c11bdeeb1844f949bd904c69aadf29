import { mergeDefaultProps } from "@kobalte/utils";
import { CalendarRoot } from "../calendar/calendar-root";
import { useFormControlContext } from "../form-control";
import { useDatePickerContext } from "./date-picker-context";
export function DatePickerCalendar(props) {
    const formControlContext = useFormControlContext();
    const context = useDatePickerContext();
    props = mergeDefaultProps({
        id: context.generateId("calendar"),
    }, props);
    return (<CalendarRoot autoFocus selectionMode={context.selectionMode()} value={context.dateValue()} onChange={context.setDateValue} locale={context.locale()} createCalendar={context.createCalendar} isDateUnavailable={context.isDateUnavailable} visibleDuration={context.visibleDuration()} allowsNonContiguousRanges={context.allowsNonContiguousRanges()} defaultFocusedValue={context.dateValue() ? undefined : context.placeholderValue()} minValue={context.minValue()} maxValue={context.maxValue()} disabled={formControlContext.isDisabled()} readOnly={formControlContext.isReadOnly()} validationState={context.validationState()} {...props}/>);
}
