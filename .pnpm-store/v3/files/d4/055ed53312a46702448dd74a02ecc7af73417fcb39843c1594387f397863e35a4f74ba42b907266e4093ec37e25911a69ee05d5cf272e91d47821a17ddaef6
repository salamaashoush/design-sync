/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/99ca82e87ba2d7fdd54f5b49326fd242320b4b51/packages/%40react-aria/spinbutton/src/useSpinButton.ts
 */
import { OverrideComponentProps, ValidationState } from "@kobalte/utils";
import { JSX } from "solid-js";
import { AsChildProp } from "../polymorphic";
export interface SpinButtonRootOptions extends AsChildProp {
    /** The controlled value of the spin button. */
    value?: number;
    /** The string representation of the value. */
    textValue?: string;
    /** The smallest value allowed for the spin button. */
    minValue?: number;
    /** The largest value allowed for the spin button. */
    maxValue?: number;
    /** Whether the spin button should display its "valid" or "invalid" visual styling. */
    validationState?: ValidationState;
    /** Whether the user must fill the spin button before the owning form can be submitted. */
    required?: boolean;
    /** Whether the spin button is disabled. */
    disabled?: boolean;
    /** Whether the spin button is read only. */
    readOnly?: boolean;
    /** Event handler called to increment the value of the spin button by one step. */
    onIncrement?: () => void;
    /** Event handler called to increment the value of the spin button by one page. */
    onIncrementPage?: () => void;
    /** Event handler called to decrement the value of the spin button by one step. */
    onDecrement?: () => void;
    /** Event handler called to decrement the value of the spin button by one page. */
    onDecrementPage?: () => void;
    /** Event handler called to decrement the value of the spin button to the `minValue`. */
    onDecrementToMin?: () => void;
    /** Event handler called to increment the value of the spin button to the `maxValue`. */
    onIncrementToMax?: () => void;
}
export interface SpinButtonRootProps extends OverrideComponentProps<"div", SpinButtonRootOptions> {
}
export declare function SpinButtonRoot(props: SpinButtonRootProps): JSX.Element;
