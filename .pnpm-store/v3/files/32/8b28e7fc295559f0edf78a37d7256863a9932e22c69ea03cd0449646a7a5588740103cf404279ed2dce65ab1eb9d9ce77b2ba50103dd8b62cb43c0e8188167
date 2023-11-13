/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/radio/src/useRadio.ts
 */
import { callHandler, createGenerateId, mergeDefaultProps, } from "@kobalte/utils";
import { createMemo, createSignal, createUniqueId, splitProps } from "solid-js";
import { useFormControlContext } from "../form-control";
import { Polymorphic } from "../polymorphic";
import { createRegisterId } from "../primitives";
import { useRadioGroupContext } from "./radio-group-context";
import { RadioGroupItemContext, } from "./radio-group-item-context";
/**
 * The root container for a radio button.
 */
export function RadioGroupItem(props) {
    const formControlContext = useFormControlContext();
    const radioGroupContext = useRadioGroupContext();
    const defaultId = `${formControlContext.generateId("item")}-${createUniqueId()}`;
    props = mergeDefaultProps({
        id: defaultId,
    }, props);
    const [local, others] = splitProps(props, ["value", "disabled", "onPointerDown"]);
    const [inputId, setInputId] = createSignal();
    const [labelId, setLabelId] = createSignal();
    const [descriptionId, setDescriptionId] = createSignal();
    const [inputRef, setInputRef] = createSignal();
    const [isFocused, setIsFocused] = createSignal(false);
    const isSelected = createMemo(() => {
        return radioGroupContext.isSelectedValue(local.value);
    });
    const isDisabled = createMemo(() => {
        return local.disabled || formControlContext.isDisabled() || false;
    });
    const onPointerDown = e => {
        callHandler(e, local.onPointerDown);
        // For consistency with native, prevent the input blurs on pointer down.
        if (isFocused()) {
            e.preventDefault();
        }
    };
    const dataset = createMemo(() => ({
        ...formControlContext.dataset(),
        "data-disabled": isDisabled() ? "" : undefined,
        "data-checked": isSelected() ? "" : undefined,
    }));
    const context = {
        value: () => local.value,
        dataset,
        isSelected,
        isDisabled,
        inputId,
        labelId,
        descriptionId,
        inputRef,
        select: () => radioGroupContext.setSelectedValue(local.value),
        generateId: createGenerateId(() => others.id),
        registerInput: createRegisterId(setInputId),
        registerLabel: createRegisterId(setLabelId),
        registerDescription: createRegisterId(setDescriptionId),
        setIsFocused,
        setInputRef,
    };
    return (<RadioGroupItemContext.Provider value={context}>
      <Polymorphic as="div" role="group" onPointerDown={onPointerDown} {...dataset()} {...others}/>
    </RadioGroupItemContext.Provider>);
}
