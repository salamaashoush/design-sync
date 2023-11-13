/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/label/src/useField.ts
 */
import { MaybeAccessor, ValidationState } from "@kobalte/utils";
import { FormControlContextValue } from "./form-control-context";
export interface CreateFormControlProps {
    /**
     * A unique identifier for the component.
     * The id is used to generate id attributes for nested components.
     * If no id prop is provided, a generated id will be used.
     */
    id?: MaybeAccessor<string | undefined>;
    /**
     * The name of the form control.
     * Submitted with its owning form as part of a name/value pair.
     */
    name?: MaybeAccessor<string | undefined>;
    /** Whether the form control should display its "valid" or "invalid" visual styling. */
    validationState?: MaybeAccessor<ValidationState | undefined>;
    /** Whether the user must fill the form control before the owning form can be submitted. */
    required?: MaybeAccessor<boolean | undefined>;
    /** Whether the form control is disabled. */
    disabled?: MaybeAccessor<boolean | undefined>;
    /** Whether the form control is read only. */
    readOnly?: MaybeAccessor<boolean | undefined>;
}
export declare const FORM_CONTROL_PROP_NAMES: readonly ["id", "name", "validationState", "required", "disabled", "readOnly"];
export declare function createFormControl(props: CreateFormControlProps): {
    formControlContext: FormControlContextValue;
};
