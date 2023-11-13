/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/radio/src/useRadioGroup.ts
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-stately/radio/src/useRadioGroupState.ts
 */
import { access, mergeDefaultProps, mergeRefs, } from "@kobalte/utils";
import { createUniqueId, splitProps } from "solid-js";
import { createFormControl, FORM_CONTROL_PROP_NAMES, FormControlContext } from "../form-control";
import { Polymorphic } from "../polymorphic";
import { createControllableSignal, createFormResetListener } from "../primitives";
import { RadioGroupContext } from "./radio-group-context";
/**
 * A set of checkable buttons, known as radio buttons, where no more than one of the buttons can be checked at a time.
 * This component is based on the [WAI-ARIA Radio Group Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radiobutton/)
 */
export function RadioGroupRoot(props) {
    let ref;
    const defaultId = `radiogroup-${createUniqueId()}`;
    props = mergeDefaultProps({
        id: defaultId,
        orientation: "vertical",
    }, props);
    const [local, formControlProps, others] = splitProps(props, [
        "ref",
        "value",
        "defaultValue",
        "onChange",
        "orientation",
        "aria-labelledby",
        "aria-describedby",
    ], FORM_CONTROL_PROP_NAMES);
    const [selected, setSelected] = createControllableSignal({
        value: () => local.value,
        defaultValue: () => local.defaultValue,
        onChange: value => local.onChange?.(value),
    });
    const { formControlContext } = createFormControl(formControlProps);
    createFormResetListener(() => ref, () => setSelected(local.defaultValue ?? ""));
    const ariaLabelledBy = () => {
        return formControlContext.getAriaLabelledBy(access(formControlProps.id), others["aria-label"], local["aria-labelledby"]);
    };
    const ariaDescribedBy = () => {
        return formControlContext.getAriaDescribedBy(local["aria-describedby"]);
    };
    const isSelectedValue = (value) => {
        return value === selected();
    };
    const context = {
        ariaDescribedBy,
        isSelectedValue,
        setSelectedValue: value => {
            if (formControlContext.isReadOnly() || formControlContext.isDisabled()) {
                return;
            }
            setSelected(value);
            // Sync all radio input checked state in the group with the selected value.
            // This is necessary because checked state might be out of sync
            // (ex: when using controlled radio-group).
            ref?.querySelectorAll("[type='radio']").forEach(el => {
                const radio = el;
                radio.checked = isSelectedValue(radio.value);
            });
        },
    };
    return (<FormControlContext.Provider value={formControlContext}>
      <RadioGroupContext.Provider value={context}>
        <Polymorphic as="div" ref={mergeRefs(el => (ref = el), local.ref)} role="radiogroup" id={access(formControlProps.id)} aria-invalid={formControlContext.validationState() === "invalid" || undefined} aria-required={formControlContext.isRequired() || undefined} aria-disabled={formControlContext.isDisabled() || undefined} aria-readonly={formControlContext.isReadOnly() || undefined} aria-orientation={local.orientation} aria-labelledby={ariaLabelledBy()} aria-describedby={ariaDescribedBy()} {...formControlContext.dataset()} {...others}/>
      </RadioGroupContext.Provider>
    </FormControlContext.Provider>);
}
