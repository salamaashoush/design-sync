/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a13802d8be6f83af1450e56f7a88527b10d9cadf/packages/@react-stately/toggle/src/useToggleState.ts
 */
import { access } from "@kobalte/utils";
import { createControllableBooleanSignal } from "../create-controllable-signal";
/**
 * Provides state management for toggle components like checkboxes and switches.
 */
export function createToggleState(props = {}) {
    const [isSelected, _setIsSelected] = createControllableBooleanSignal({
        value: () => access(props.isSelected),
        defaultValue: () => !!access(props.defaultIsSelected),
        onChange: value => props.onSelectedChange?.(value),
    });
    const setIsSelected = (value) => {
        if (!access(props.isReadOnly) && !access(props.isDisabled)) {
            _setIsSelected(value);
        }
    };
    const toggle = () => {
        if (!access(props.isReadOnly) && !access(props.isDisabled)) {
            _setIsSelected(!isSelected());
        }
    };
    return {
        isSelected,
        setIsSelected,
        toggle,
    };
}
