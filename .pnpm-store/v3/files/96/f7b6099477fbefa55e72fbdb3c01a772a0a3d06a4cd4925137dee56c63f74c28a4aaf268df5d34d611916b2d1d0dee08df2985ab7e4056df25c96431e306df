/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/radio/src/useRadioGroup.ts
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-stately/radio/src/useRadioGroupState.ts
 */
import { Orientation, OverrideComponentProps, ValidationState } from "@kobalte/utils";
import { AsChildProp } from "../polymorphic";
export interface RadioGroupRootOptions extends AsChildProp {
    /** The controlled value of the radio button to check. */
    value?: string;
    /**
     * The value of the radio button that should be checked when initially rendered.
     * Useful when you do not need to control the state of the radio buttons.
     */
    defaultValue?: string;
    /** Event handler called when the value changes. */
    onChange?: (value: string) => void;
    /** The axis the radio group items should align with. */
    orientation?: Orientation;
    /**
     * A unique identifier for the component.
     * The id is used to generate id attributes for nested components.
     * If no id prop is provided, a generated id will be used.
     */
    id?: string;
    /**
     * The name of the radio group.
     * Submitted with its owning form as part of a name/value pair.
     */
    name?: string;
    /** Whether the radio group should display its "valid" or "invalid" visual styling. */
    validationState?: ValidationState;
    /** Whether the user must select an item before the owning form can be submitted. */
    required?: boolean;
    /** Whether the radio group is disabled. */
    disabled?: boolean;
    /** Whether the radio group is read only. */
    readOnly?: boolean;
}
export interface RadioGroupRootProps extends OverrideComponentProps<"div", RadioGroupRootOptions> {
}
/**
 * A set of checkable buttons, known as radio buttons, where no more than one of the buttons can be checked at a time.
 * This component is based on the [WAI-ARIA Radio Group Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radiobutton/)
 */
export declare function RadioGroupRoot(props: RadioGroupRootProps): import("solid-js").JSX.Element;
