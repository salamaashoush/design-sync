/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/950d45db36e63851f411ed0dc6a5aad0af57da68/packages/@react-types/datepicker/src/index.d.ts
 */
import { DateFormatter, toCalendarDate, toCalendarDateTime, } from "@internationalized/date";
import { access, createFocusManager, createGenerateId, mergeDefaultProps, } from "@kobalte/utils";
import { createEffect, createMemo, createSignal, createUniqueId, mergeProps, on, splitProps, } from "solid-js";
import { asArrayValue, asSingleValue, getArrayValueOfSelection, getFirstValueOfSelection, isDateInvalid, } from "../calendar/utils";
import { createFormControl, FORM_CONTROL_PROP_NAMES, FormControlContext } from "../form-control";
import { createMessageFormatter, getReadingDirection, useLocale } from "../i18n";
import { Polymorphic } from "../polymorphic";
import { PopperRoot } from "../popper";
import { createControllableSignal, createDisclosureState, createFormResetListener, createPresence, createRegisterId, } from "../primitives";
import { DATE_PICKER_INTL_MESSAGES } from "./date-picker.intl";
import { DatePickerContext, } from "./date-picker-context";
import { createDefaultProps, getDateFieldFormatOptions, getPlaceholderTime } from "./utils";
/**
 * A date picker combines a `DateField` and a `Calendar` popover to allow users to enter or select a date and time value.
 */
export function DatePickerRoot(props) {
    const defaultId = `date-picker-${createUniqueId()}`;
    props = mergeDefaultProps({
        id: defaultId,
        visibleDuration: { months: 1 },
        selectionMode: "single",
        maxGranularity: "year",
        hideTimeZone: false,
        shouldForceLeadingZeros: false,
        modal: false,
        gutter: 8,
        sameWidth: false,
        placement: "bottom-start",
    }, props);
    const [local, popperProps, formControlProps, others] = splitProps(props, [
        "locale",
        "createCalendar",
        "visibleDuration",
        "selectionMode",
        "isDateUnavailable",
        "allowsNonContiguousRanges",
        "closeOnSelect",
        "minValue",
        "maxValue",
        "placeholderValue",
        "hourCycle",
        "granularity",
        "maxGranularity",
        "hideTimeZone",
        "shouldForceLeadingZeros",
        "validationState",
        "open",
        "defaultOpen",
        "onOpenChange",
        "value",
        "defaultValue",
        "onChange",
        "modal",
        "forceMount",
    ], [
        "getAnchorRect",
        "placement",
        "gutter",
        "shift",
        "flip",
        "slide",
        "overlap",
        "sameWidth",
        "fitViewport",
        "hideWhenDetached",
        "detachedPadding",
        "arrowPadding",
        "overflowPadding",
    ], FORM_CONTROL_PROP_NAMES);
    const [triggerId, setTriggerId] = createSignal();
    const [contentId, setContentId] = createSignal();
    const [controlRef, setControlRef] = createSignal();
    const [triggerRef, setTriggerRef] = createSignal();
    const [contentRef, setContentRef] = createSignal();
    const messageFormatter = createMessageFormatter(() => DATE_PICKER_INTL_MESSAGES);
    const locale = createMemo(() => {
        return local.locale ?? useLocale().locale();
    });
    const direction = createMemo(() => {
        return getReadingDirection(locale());
    });
    const focusManager = createFocusManager(controlRef);
    const closeOnSelect = createMemo(() => {
        return local.closeOnSelect ?? local.selectionMode !== "multiple";
    });
    const [value, setValue] = createControllableSignal({
        value: () => local.value,
        defaultValue: () => local.defaultValue,
        onChange: value => local.onChange?.(value),
    });
    // The date portion of the selected date, dates or range.
    const [selectedDate, setSelectedDate] = createSignal();
    // The time portion of the selected date or range.
    const [selectedTime, setSelectedTime] = createSignal();
    const disclosureState = createDisclosureState({
        open: () => local.open,
        defaultOpen: () => local.defaultOpen,
        onOpenChange: isOpen => local.onOpenChange?.(isOpen),
    });
    const { granularity, defaultTimeZone } = createDefaultProps({
        value: () => getFirstValueOfSelection(local.selectionMode, value()) ?? local.placeholderValue,
        granularity: () => local.granularity,
    });
    const contentPresence = createPresence(() => local.forceMount || disclosureState.isOpen());
    const validationState = createMemo(() => {
        if (local.validationState) {
            return local.validationState;
        }
        const values = getArrayValueOfSelection(local.selectionMode, value());
        if (values.length <= 0) {
            return undefined;
        }
        const isSomeDateInvalid = values.some(date => {
            return local.isDateUnavailable?.(date) || isDateInvalid(date, local.minValue, local.maxValue);
        });
        return isSomeDateInvalid ? "invalid" : undefined;
    });
    const { formControlContext } = createFormControl(mergeProps(formControlProps, {
        // override the `validationState` provided by prop to include additional logic.
        get validationState() {
            return validationState();
        },
    }));
    createFormResetListener(contentRef, () => {
        setValue(local.defaultValue);
    });
    const hasTime = createMemo(() => {
        return granularity() === "hour" || granularity() === "minute" || granularity() === "second";
    });
    const formattedValue = createMemo(() => {
        const firstValue = getFirstValueOfSelection(local.selectionMode, value());
        if (!firstValue) {
            return "";
        }
        const formatOptions = getDateFieldFormatOptions({ month: "long" }, {
            granularity: granularity(),
            timeZone: defaultTimeZone(),
            hideTimeZone: local.hideTimeZone,
            hourCycle: local.hourCycle,
            showEra: firstValue.calendar.identifier === "gregory" && firstValue.era === "BC",
        });
        const dateFormatter = createMemo(() => new DateFormatter(locale(), formatOptions));
        const formatDate = (date) => {
            return date ? dateFormatter().format(date.toDate(defaultTimeZone() ?? "UTC")) : "";
        };
        let formattedValue;
        if (local.selectionMode === "single") {
            formattedValue = formatDate(asSingleValue(value()));
        }
        else if (local.selectionMode === "multiple") {
            formattedValue = asArrayValue(value())?.map(formatDate).join(", ");
        }
        else if (local.selectionMode === "range") {
            // TODO: RangeDatePicker
        }
        return formattedValue ?? "";
    });
    const ariaDescribedBy = () => {
        let description = "";
        if (local.selectionMode === "single" || local.selectionMode === "multiple") {
            description = messageFormatter().format("selectedDateDescription", {
                date: formattedValue(),
            });
        }
        else if (local.selectionMode === "range") {
            // TODO: RangeDatePicker
        }
        return formControlContext.getAriaDescribedBy(description);
    };
    const commitSingleValue = (date, time) => {
        setValue("timeZone" in time ? time.set(toCalendarDate(date)) : toCalendarDateTime(date, time));
    };
    const commitRangeValue = (dateRange, timeRange) => {
        // TODO: RangeDatePicker
    };
    // Intercept `setValue` to make sure the Time section is not changed by date selection in Calendar.
    const selectDate = (newValue) => {
        if (local.selectionMode === "single") {
            if (hasTime()) {
                const resolvedSelectedTime = selectedTime();
                if (resolvedSelectedTime || closeOnSelect()) {
                    commitSingleValue(newValue, resolvedSelectedTime || getPlaceholderTime(local.placeholderValue));
                }
                else {
                    setSelectedDate(newValue);
                }
            }
            else {
                setValue(newValue);
            }
            if (closeOnSelect()) {
                disclosureState.close();
            }
        }
        else if (local.selectionMode === "multiple") {
            setValue(newValue);
        }
        else if (local.selectionMode === "range") {
            // TODO: RangeDatePicker
        }
    };
    const selectTime = (newValue) => {
        if (local.selectionMode === "single") {
            const resolvedSelectedDate = selectedDate();
            if (resolvedSelectedDate && newValue) {
                commitSingleValue(resolvedSelectedDate, newValue);
            }
            else {
                setSelectedTime(newValue);
            }
        }
        else if (local.selectionMode === "range") {
            // TODO: RangeDatePicker
        }
    };
    const close = () => {
        if (local.selectionMode === "single") {
            const resolvedSelectedDate = selectedDate();
            const resolvedSelectedTime = selectedTime();
            // Commit the selected date when the calendar is closed. Use a placeholder time if one wasn't set.
            // If only the time was set and not the date, don't commit.
            // The state will be preserved until the user opens the popover again.
            if (!value() && resolvedSelectedDate && hasTime()) {
                commitSingleValue(resolvedSelectedDate, resolvedSelectedTime || getPlaceholderTime(local.placeholderValue));
            }
        }
        else if (local.selectionMode === "range") {
            // TODO: RangeDatePicker
        }
        disclosureState.close();
    };
    const toggle = () => {
        if (disclosureState.isOpen()) {
            close();
        }
        else {
            disclosureState.open();
        }
    };
    const dataset = createMemo(() => ({
        "data-expanded": disclosureState.isOpen() ? "" : undefined,
        "data-closed": !disclosureState.isOpen() ? "" : undefined,
    }));
    createEffect(on(value, value => {
        if (!value) {
            setSelectedDate(undefined);
            setSelectedTime(undefined);
            return;
        }
        if (local.selectionMode === "single") {
            setSelectedDate(value);
            if ("hour" in value) {
                setSelectedTime(value);
            }
        }
        else if (local.selectionMode === "multiple") {
            setSelectedDate(value);
        }
        else if (local.selectionMode === "range") {
            // TODO: RangeDatePicker
        }
    }));
    const context = {
        dataset,
        isOpen: disclosureState.isOpen,
        isDisabled: () => formControlContext.isDisabled() ?? false,
        isModal: () => local.modal ?? false,
        contentPresence,
        messageFormatter,
        granularity,
        maxGranularity: () => local.maxGranularity,
        hourCycle: () => local.hourCycle,
        hideTimeZone: () => local.hideTimeZone ?? false,
        defaultTimeZone,
        shouldForceLeadingZeros: () => local.shouldForceLeadingZeros ?? false,
        visibleDuration: () => local.visibleDuration,
        selectionMode: () => local.selectionMode,
        allowsNonContiguousRanges: () => local.allowsNonContiguousRanges ?? false,
        placeholderValue: () => local.placeholderValue,
        minValue: () => local.minValue,
        maxValue: () => local.maxValue,
        focusManager: () => focusManager,
        locale,
        direction,
        ariaDescribedBy,
        validationState,
        value,
        dateValue: selectedDate,
        timeValue: selectedTime,
        triggerId,
        contentId,
        controlRef,
        triggerRef,
        contentRef,
        setControlRef,
        setTriggerRef,
        setContentRef,
        createCalendar: name => local.createCalendar(name),
        isDateUnavailable: date => local.isDateUnavailable?.(date) ?? false,
        setDateValue: selectDate,
        setTimeValue: selectTime,
        open: disclosureState.open,
        close,
        toggle,
        generateId: createGenerateId(() => access(formControlProps.id)),
        registerTriggerId: createRegisterId(setTriggerId),
        registerContentId: createRegisterId(setContentId),
    };
    return (<FormControlContext.Provider value={formControlContext}>
      <DatePickerContext.Provider value={context}>
        <PopperRoot anchorRef={controlRef} contentRef={contentRef} {...popperProps}>
          <Polymorphic as="div" role="group" id={access(formControlProps.id)} {...formControlContext.dataset()} {...dataset()} {...others}/>
        </PopperRoot>
      </DatePickerContext.Provider>
    </FormControlContext.Provider>);
}
