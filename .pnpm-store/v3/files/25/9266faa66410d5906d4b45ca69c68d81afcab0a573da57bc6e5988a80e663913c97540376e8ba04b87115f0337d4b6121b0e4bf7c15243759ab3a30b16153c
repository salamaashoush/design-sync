import { Body as CalendarBody, Grid as CalendarGrid, GridBody as CalendarGridBody, GridBodyCell as CalendarGridBodyCell, GridBodyCellTrigger as CalendarGridBodyCellTrigger, GridBodyRow as CalendarGridBodyRow, GridHeader as CalendarGridHeader, GridHeaderCell as CalendarGridHeaderCell, GridHeaderRow as CalendarGridHeaderRow, Header as CalendarHeader, Heading as CalendarHeading, NextTrigger as CalendarNextTrigger, PrevTrigger as CalendarPrevTrigger, } from "../calendar";
import { FormControlDescription as Description, FormControlErrorMessage as ErrorMessage, } from "../form-control";
import { PopperArrow as Arrow, } from "../popper";
import { DatePickerCalendar as Calendar, } from "./date-picker-calendar";
import { DatePickerContent as Content, } from "./date-picker-content";
import { DatePickerControl as Control, } from "./date-picker-control";
import { DatePickerInput as Input, } from "./date-picker-input";
import { DatePickerPortal as Portal } from "./date-picker-portal";
import { DatePickerRoot as Root, } from "./date-picker-root";
import { DatePickerSegment as Segment, } from "./date-picker-segment";
import { DatePickerTrigger as Trigger } from "./date-picker-trigger";
export { Arrow, Calendar, CalendarBody, CalendarGrid, CalendarGridBody, CalendarGridBodyCell, CalendarGridBodyCellTrigger, CalendarGridBodyRow, CalendarGridHeader, CalendarGridHeaderCell, CalendarGridHeaderRow, CalendarHeader, CalendarHeading, CalendarNextTrigger, CalendarPrevTrigger, Content, Control, Description, ErrorMessage, Input, Portal, Root, Segment, Trigger, };
/*

<DatePicker.Root>
  <DatePicker.Label/>
  <DatePicker.Control>
    <DatePicker.Input> // DateField
      {segment => <DatePicker.Segment segment={segment} />}
    </DatePicker.Input>
    <DatePicker.Trigger/>
  </DatePicker.Control>
  <DatePicker.Description/>
  <DatePicker.ErrorMessage/>
  <DatePicker.Portal>
    <DatePicker.Content>
      <DatePicker.Arrow/>
      <DatePicker.Calendar>
        <DatePicker.CalendarHeader>
          <DatePicker.CalendarPrevTrigger/>
          <DatePicker.CalendarViewTrigger/>
          <DatePicker.CalendarNextTrigger/>
        </DatePicker.CalendarHeader>
        <DatePicker.CalendarBody>
          <DatePicker.CalendarGrid>
            <DatePicker.CalendarGridHeader>
              <DatePicker.CalendarGridHeaderRow>
                {weekDay => (
                  <DatePicker.CalendarGridHeaderCell>
                    {weekDay()}
                  </DatePicker.CalendarGridHeaderCell>
                )}
              </DatePicker.CalendarGridHeaderRow>
            </DatePicker.CalendarGridHeader>
            <DatePicker.CalendarGridBody>
              {weekIndex => (
                <DatePicker.CalendarGridBodyRow weekIndex={weekIndex()}>
                  {date => (
                    <DatePicker.CalendarGridBodyCell date={date()}>
                      <DatePicker.CalendarGridBodyCellTrigger/>
                    </DatePicker.CalendarGridBodyCell>
                  )}
                </DatePicker.CalendarGridBodyRow>
              )}
            </DatePicker.CalendarGridBody>
          </DatePicker.CalendarGrid>
        </DatePicker.CalendarBody>
      </DatePicker.Calendar>
    </DatePicker.Content>
  </DatePicker.Portal>
</DatePicker.Root>

*/
