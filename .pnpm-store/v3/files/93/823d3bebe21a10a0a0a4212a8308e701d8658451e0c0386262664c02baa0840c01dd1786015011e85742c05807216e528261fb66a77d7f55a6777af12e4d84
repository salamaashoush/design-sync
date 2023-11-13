/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/3155e4db7eba07cf06525747ce0adb54c1e2a086/packages/@react-aria/checkbox/src/useCheckbox.ts
 */
import { access, callHandler, createGenerateId, isFunction, mergeDefaultProps, mergeRefs, } from "@kobalte/utils";
import { children, createMemo, createSignal, createUniqueId, splitProps, } from "solid-js";
import { createFormControl, FORM_CONTROL_PROP_NAMES, FormControlContext } from "../form-control";
import { Polymorphic } from "../polymorphic";
import { createFormResetListener, createToggleState } from "../primitives";
import { CheckboxContext } from "./checkbox-context";
/**
 * A control that allows the user to toggle between checked and not checked.
 */
export function CheckboxRoot(props) {
    let ref;
    const defaultId = `checkbox-${createUniqueId()}`;
    props = mergeDefaultProps({
        value: "on",
        id: defaultId,
    }, props);
    const [local, formControlProps, others] = splitProps(props, [
        "ref",
        "children",
        "value",
        "checked",
        "defaultChecked",
        "indeterminate",
        "onChange",
        "onPointerDown",
    ], FORM_CONTROL_PROP_NAMES);
    const [inputRef, setInputRef] = createSignal();
    const [isFocused, setIsFocused] = createSignal(false);
    const { formControlContext } = createFormControl(formControlProps);
    const state = createToggleState({
        isSelected: () => local.checked,
        defaultIsSelected: () => local.defaultChecked,
        onSelectedChange: selected => local.onChange?.(selected),
        isDisabled: () => formControlContext.isDisabled(),
        isReadOnly: () => formControlContext.isReadOnly(),
    });
    createFormResetListener(() => ref, () => state.setIsSelected(local.defaultChecked ?? false));
    const onPointerDown = e => {
        callHandler(e, local.onPointerDown);
        // For consistency with native, prevent the input blurs on pointer down.
        if (isFocused()) {
            e.preventDefault();
        }
    };
    const dataset = createMemo(() => ({
        "data-checked": state.isSelected() ? "" : undefined,
        "data-indeterminate": local.indeterminate ? "" : undefined,
    }));
    const context = {
        value: () => local.value,
        dataset,
        checked: () => state.isSelected(),
        indeterminate: () => local.indeterminate ?? false,
        inputRef,
        generateId: createGenerateId(() => access(formControlProps.id)),
        toggle: () => state.toggle(),
        setIsChecked: isChecked => state.setIsSelected(isChecked),
        setIsFocused,
        setInputRef,
    };
    return (<FormControlContext.Provider value={formControlContext}>
      <CheckboxContext.Provider value={context}>
        <Polymorphic as="div" ref={mergeRefs(el => (ref = el), local.ref)} role="group" id={access(formControlProps.id)} onPointerDown={onPointerDown} {...formControlContext.dataset()} {...dataset()} {...others}>
          <CheckboxRootChild state={context} children={local.children}/>
        </Polymorphic>
      </CheckboxContext.Provider>
    </FormControlContext.Provider>);
}
function CheckboxRootChild(props) {
    const resolvedChildren = children(() => {
        const body = props.children;
        return isFunction(body) ? body(props.state) : body;
    });
    return <>{resolvedChildren()}</>;
}
