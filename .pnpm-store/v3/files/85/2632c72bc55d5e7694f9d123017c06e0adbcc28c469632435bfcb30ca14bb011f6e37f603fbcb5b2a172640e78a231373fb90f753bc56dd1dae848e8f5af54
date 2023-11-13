/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-aria/select/src/HiddenSelect.tsx
 */
import { callHandler, mergeRefs, visuallyHiddenStyles } from "@kobalte/utils";
import { createEffect, createSignal, For, on, Show, splitProps } from "solid-js";
import { useFormControlContext } from "../form-control";
import { isSameSelection } from "../selection/utils";
/**
 * Renders a hidden native `<select>` element, which can be used to support browser
 * form autofill, mobile form navigation, and native form submission.
 */
export function HiddenSelectBase(props) {
    let ref;
    const [local, others] = splitProps(props, [
        "ref",
        "onChange",
        "collection",
        "selectionManager",
        "isOpen",
        "isMultiple",
        "isVirtualized",
        "focusTrigger",
    ]);
    const formControlContext = useFormControlContext();
    const [isInternalChangeEvent, setIsInternalChangeEvent] = createSignal(false);
    const renderOption = (key) => {
        const item = local.collection.getItem(key);
        return (<Show when={item?.type === "item"}>
        <option value={key} selected={local.selectionManager.isSelected(key)}>
          {item?.textValue}
        </option>
      </Show>);
    };
    // Dispatch native event on selection change for form libraries.
    createEffect(on(() => local.selectionManager.selectedKeys(), (keys, prevKeys) => {
        if (prevKeys && isSameSelection(keys, prevKeys)) {
            return;
        }
        setIsInternalChangeEvent(true);
        ref?.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
        ref?.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
    }, {
        defer: true,
    }));
    // If virtualized, only render the selected options in the hidden <select> so the value can be submitted to a server.
    // Otherwise, render all options so that browser autofill will work.
    return (<div style={visuallyHiddenStyles} aria-hidden="true">
      <input type="text" tabIndex={local.selectionManager.isFocused() || local.isOpen ? -1 : 0} style={{ "font-size": "16px" }} required={formControlContext.isRequired()} disabled={formControlContext.isDisabled()} readOnly={formControlContext.isReadOnly()} onFocus={() => local.focusTrigger()}/>
      <select ref={mergeRefs(el => (ref = el), local.ref)} tabIndex={-1} multiple={local.isMultiple} name={formControlContext.name()} required={formControlContext.isRequired()} disabled={formControlContext.isDisabled()} size={local.collection.getSize()} value={local.selectionManager.firstSelectedKey() ?? ""} onChange={e => {
            callHandler(e, local.onChange);
            // Prevent internally fired change event to update the selection
            // which would result in an infinite loop.
            if (!isInternalChangeEvent()) {
                // enable form autofill
                local.selectionManager.setSelectedKeys(new Set([e.target.value]));
            }
            setIsInternalChangeEvent(false);
        }} {...others}>
        <option />
        <Show when={local.isVirtualized} fallback={<For each={[...local.collection.getKeys()]}>{renderOption}</For>}>
          <For each={[...local.selectionManager.selectedKeys()]}>{renderOption}</For>
        </Show>
      </select>
    </div>);
}
