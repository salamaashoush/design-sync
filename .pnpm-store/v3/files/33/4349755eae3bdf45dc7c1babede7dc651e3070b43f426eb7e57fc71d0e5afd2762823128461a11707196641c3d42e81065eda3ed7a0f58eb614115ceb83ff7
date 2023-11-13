import { access, createGenerateId, mergeDefaultProps, mergeRefs, } from "@kobalte/utils";
import { createUniqueId, splitProps } from "solid-js";
import { createFormControl, FORM_CONTROL_PROP_NAMES, FormControlContext } from "../form-control";
import { Polymorphic } from "../polymorphic";
import { createControllableSignal, createFormResetListener } from "../primitives";
import { TextFieldContext } from "./text-field-context";
/**
 * A text input that allow users to input custom text entries with a keyboard.
 */
export function TextFieldRoot(props) {
    let ref;
    const defaultId = `textfield-${createUniqueId()}`;
    props = mergeDefaultProps({ id: defaultId }, props);
    const [local, formControlProps, others] = splitProps(props, ["ref", "value", "defaultValue", "onChange"], FORM_CONTROL_PROP_NAMES);
    const [value, setValue] = createControllableSignal({
        value: () => local.value,
        defaultValue: () => local.defaultValue,
        onChange: value => local.onChange?.(value),
    });
    const { formControlContext } = createFormControl(formControlProps);
    createFormResetListener(() => ref, () => setValue(local.defaultValue ?? ""));
    const onInput = e => {
        if (formControlContext.isReadOnly() || formControlContext.isDisabled()) {
            return;
        }
        const target = e.target;
        setValue(target.value);
        // Unlike in React, inputs `value` can be out of sync with our value state.
        // even if an input is controlled (ex: `<input value="foo" />`,
        // typing on the input will change its internal `value`.
        //
        // To prevent this, we need to force the input `value` to be in sync with the text field value state.
        target.value = value() ?? "";
    };
    const context = {
        value,
        generateId: createGenerateId(() => access(formControlProps.id)),
        onInput,
    };
    return (<FormControlContext.Provider value={formControlContext}>
      <TextFieldContext.Provider value={context}>
        <Polymorphic as="div" ref={mergeRefs(el => (ref = el), local.ref)} role="group" id={access(formControlProps.id)} {...formControlContext.dataset()} {...others}/>
      </TextFieldContext.Provider>
    </FormControlContext.Provider>);
}
