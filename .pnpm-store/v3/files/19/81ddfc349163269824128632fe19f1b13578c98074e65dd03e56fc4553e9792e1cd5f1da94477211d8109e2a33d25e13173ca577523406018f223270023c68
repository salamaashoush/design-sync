/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/99ca82e87ba2d7fdd54f5b49326fd242320b4b51/packages/%40react-aria/spinbutton/src/useSpinButton.ts
 */
import { callHandler, mergeRefs } from "@kobalte/utils";
import { createEffect, createMemo, on, splitProps } from "solid-js";
import { createMessageFormatter } from "../i18n";
import { announce, clearAnnouncer } from "../live-announcer";
import { Polymorphic } from "../polymorphic";
import { SPIN_BUTTON_INTL_MESSAGES } from "./spin-button.intl";
export function SpinButtonRoot(props) {
    let ref;
    const [local, others] = splitProps(props, [
        "ref",
        "value",
        "textValue",
        "minValue",
        "maxValue",
        "validationState",
        "required",
        "disabled",
        "readOnly",
        "onIncrement",
        "onIncrementPage",
        "onDecrement",
        "onDecrementPage",
        "onDecrementToMin",
        "onIncrementToMax",
        "onKeyDown",
        "onFocus",
        "onBlur",
    ]);
    let isFocused = false;
    const messageFormatter = createMessageFormatter(SPIN_BUTTON_INTL_MESSAGES);
    // Replace Unicode hyphen-minus (U+002D) with minus sign (U+2212).
    // This ensures that macOS VoiceOver announces it as "minus" even with other characters between the minus sign
    // and the number (e.g. currency symbol). Otherwise, it announces nothing because it assumes the character is a hyphen.
    // In addition, replace the empty string with the word "Empty" so that iOS VoiceOver does not read "50%" for an empty field.
    const textValue = createMemo(() => {
        if (local.textValue === "") {
            return messageFormatter().format("empty");
        }
        return (local.textValue || `${local.value}`).replace("-", "\u2212");
    });
    const onKeyDown = e => {
        callHandler(e, local.onKeyDown);
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || local.readOnly) {
            return;
        }
        switch (e.key) {
            case "PageUp":
                if (local.onIncrementPage) {
                    e.preventDefault();
                    local.onIncrementPage();
                    break;
                }
            // fallthrough!
            case "ArrowUp":
            case "Up":
                if (local.onIncrement) {
                    e.preventDefault();
                    local.onIncrement();
                }
                break;
            case "PageDown":
                if (local.onDecrementPage) {
                    e.preventDefault();
                    local.onDecrementPage();
                    break;
                }
            // fallthrough
            case "ArrowDown":
            case "Down":
                if (local.onDecrement) {
                    e.preventDefault();
                    local.onDecrement();
                }
                break;
            case "Home":
                if (local.onDecrementToMin) {
                    e.preventDefault();
                    local.onDecrementToMin();
                }
                break;
            case "End":
                if (local.onIncrementToMax) {
                    e.preventDefault();
                    local.onIncrementToMax();
                }
                break;
        }
    };
    const onFocus = e => {
        callHandler(e, local.onFocus);
        isFocused = true;
    };
    const onBlur = e => {
        callHandler(e, local.onBlur);
        isFocused = false;
    };
    createEffect(on(textValue, textValue => {
        if (isFocused) {
            clearAnnouncer("assertive");
            announce(textValue, "assertive");
        }
    }));
    return (<Polymorphic ref={mergeRefs(el => (ref = el), local.ref)} as="div" role="spinbutton" aria-valuenow={local.value != null && !isNaN(local.value) ? local.value : null} aria-valuetext={textValue()} aria-valuemin={local.minValue} aria-valuemax={local.maxValue} aria-required={local.required || undefined} aria-disabled={local.disabled || undefined} aria-readonly={local.readOnly || undefined} aria-invalid={local.validationState === "invalid" || undefined} onKeyDown={onKeyDown} onFocus={onFocus} onBlur={onBlur} {...others}/>);
}
