/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/3155e4db7eba07cf06525747ce0adb54c1e2a086/packages/@react-aria/switch/src/useSwitch.ts
 */
import { OverrideComponentProps, ValidationState } from "@kobalte/utils";
import { Accessor, JSX } from "solid-js";
interface SwitchRootState {
    /** Whether the switch is checked or not. */
    checked: Accessor<boolean>;
}
export interface SwitchRootOptions {
    /** The controlled checked state of the switch. */
    checked?: boolean;
    /**
     * The default checked state when initially rendered.
     * Useful when you do not need to control the checked state.
     */
    defaultChecked?: boolean;
    /** Event handler called when the checked state of the switch changes. */
    onChange?: (isChecked: boolean) => void;
    /**
     * The value of the switch, used when submitting an HTML form.
     * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefvalue).
     */
    value?: string;
    /**
     * The name of the switch, used when submitting an HTML form.
     * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname).
     */
    name?: string;
    /** Whether the switch should display its "valid" or "invalid" visual styling. */
    validationState?: ValidationState;
    /** Whether the user must check the switch before the owning form can be submitted. */
    required?: boolean;
    /** Whether the switch is disabled. */
    disabled?: boolean;
    /** Whether the switch is read only. */
    readOnly?: boolean;
    /**
     * The children of the switch.
     * Can be a `JSX.Element` or a _render prop_ for having access to the internal state.
     */
    children?: JSX.Element | ((state: SwitchRootState) => JSX.Element);
}
export interface SwitchRootProps extends OverrideComponentProps<"div", SwitchRootOptions> {
}
/**
 * A control that allows users to choose one of two values: on or off.
 */
export declare function SwitchRoot(props: SwitchRootProps): JSX.Element;
export {};
