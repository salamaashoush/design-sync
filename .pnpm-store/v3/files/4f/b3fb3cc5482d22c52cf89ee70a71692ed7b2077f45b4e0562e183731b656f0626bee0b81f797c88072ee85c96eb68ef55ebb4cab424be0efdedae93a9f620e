/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/label/src/useField.ts
 */
import { access, createGenerateId, mergeDefaultProps, } from "@kobalte/utils";
import { createMemo, createSignal, createUniqueId } from "solid-js";
import { createRegisterId } from "../primitives";
export const FORM_CONTROL_PROP_NAMES = [
    "id",
    "name",
    "validationState",
    "required",
    "disabled",
    "readOnly",
];
export function createFormControl(props) {
    const defaultId = `form-control-${createUniqueId()}`;
    props = mergeDefaultProps({ id: defaultId }, props);
    const [labelId, setLabelId] = createSignal();
    const [fieldId, setFieldId] = createSignal();
    const [descriptionId, setDescriptionId] = createSignal();
    const [errorMessageId, setErrorMessageId] = createSignal();
    const getAriaLabelledBy = (fieldId, fieldAriaLabel, fieldAriaLabelledBy) => {
        const hasAriaLabelledBy = fieldAriaLabelledBy != null || labelId() != null;
        return ([
            fieldAriaLabelledBy,
            labelId(),
            // If there is both an aria-label and aria-labelledby, add the field itself has an aria-labelledby
            hasAriaLabelledBy && fieldAriaLabel != null ? fieldId : undefined,
        ]
            .filter(Boolean)
            .join(" ") || undefined);
    };
    const getAriaDescribedBy = (fieldAriaDescribedBy) => {
        return ([
            descriptionId(),
            // Use aria-describedby for error message because aria-errormessage is unsupported using VoiceOver or NVDA.
            // See https://github.com/adobe/react-spectrum/issues/1346#issuecomment-740136268
            errorMessageId(),
            fieldAriaDescribedBy,
        ]
            .filter(Boolean)
            .join(" ") || undefined);
    };
    const dataset = createMemo(() => ({
        "data-valid": access(props.validationState) === "valid" ? "" : undefined,
        "data-invalid": access(props.validationState) === "invalid" ? "" : undefined,
        "data-required": access(props.required) ? "" : undefined,
        "data-disabled": access(props.disabled) ? "" : undefined,
        "data-readonly": access(props.readOnly) ? "" : undefined,
    }));
    const formControlContext = {
        name: () => access(props.name) ?? access(props.id),
        dataset,
        validationState: () => access(props.validationState),
        isRequired: () => access(props.required),
        isDisabled: () => access(props.disabled),
        isReadOnly: () => access(props.readOnly),
        labelId,
        fieldId,
        descriptionId,
        errorMessageId,
        getAriaLabelledBy,
        getAriaDescribedBy,
        generateId: createGenerateId(() => access(props.id)),
        registerLabel: createRegisterId(setLabelId),
        registerField: createRegisterId(setFieldId),
        registerDescription: createRegisterId(setDescriptionId),
        registerErrorMessage: createRegisterId(setErrorMessageId),
    };
    return { formControlContext };
}
