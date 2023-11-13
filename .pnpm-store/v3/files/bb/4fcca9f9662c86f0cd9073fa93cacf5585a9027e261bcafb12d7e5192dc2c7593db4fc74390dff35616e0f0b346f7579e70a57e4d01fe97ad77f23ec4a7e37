/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-stately/calendar/src/useCalendarState.ts
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-aria/calendar/src/useCalendarBase.ts
 */
import { callHandler } from "@kobalte/utils";
import { createEffect, createMemo, splitProps } from "solid-js";
import * as Button from "../button";
import { useCalendarContext } from "./calendar-context";
import { isPreviousVisibleRangeInvalid } from "./utils";
export function CalendarPrevTrigger(props) {
    const context = useCalendarContext();
    const [local, others] = splitProps(props, ["disabled", "onClick", "onFocus", "onBlur"]);
    let prevTriggerFocused = false;
    const prevTriggerDisabled = createMemo(() => {
        return (local.disabled ||
            context.isDisabled() ||
            isPreviousVisibleRangeInvalid(context.startDate(), context.min(), context.max()));
    });
    const onClick = e => {
        callHandler(e, local.onClick);
        context.focusPreviousPage();
    };
    const onFocus = e => {
        callHandler(e, local.onFocus);
        prevTriggerFocused = true;
    };
    const onBlur = e => {
        callHandler(e, local.onBlur);
        prevTriggerFocused = false;
    };
    // If the prev trigger become disabled while they are focused, move focus to the calendar body.
    createEffect(() => {
        if (prevTriggerDisabled() && prevTriggerFocused) {
            prevTriggerFocused = false;
            context.setIsFocused(true);
        }
    });
    return (<Button.Root disabled={prevTriggerDisabled()} aria-label={context.messageFormatter().format("previous")} onClick={onClick} onFocus={onFocus} onBlur={onBlur} {...others}/>);
}
