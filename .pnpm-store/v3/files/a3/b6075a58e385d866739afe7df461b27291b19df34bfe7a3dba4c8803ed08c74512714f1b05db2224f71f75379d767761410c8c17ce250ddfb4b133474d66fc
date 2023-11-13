/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/radio/src/useRadioGroup.ts
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-stately/radio/src/useRadioGroupState.ts
 */
import { mergeDefaultProps } from "@kobalte/utils";
import { createUniqueId, splitProps } from "solid-js";
import { createControllableSignal } from "../primitives";
import { MenuGroup } from "./menu-group";
import { MenuRadioGroupContext } from "./menu-radio-group-context";
import { useMenuRootContext } from "./menu-root-context";
/**
 * A container used to group multiple `Menu.RadioItem`s and manage the selection.
 */
export function MenuRadioGroup(props) {
    const rootContext = useMenuRootContext();
    const defaultId = rootContext.generateId(`radiogroup-${createUniqueId()}`);
    props = mergeDefaultProps({
        id: defaultId,
    }, props);
    const [local, others] = splitProps(props, ["value", "defaultValue", "onChange", "disabled"]);
    const [selected, setSelected] = createControllableSignal({
        value: () => local.value,
        defaultValue: () => local.defaultValue,
        onChange: value => local.onChange?.(value),
    });
    const context = {
        isDisabled: () => local.disabled,
        isSelectedValue: (value) => value === selected(),
        setSelectedValue: setSelected,
    };
    return (<MenuRadioGroupContext.Provider value={context}>
      <MenuGroup {...others}/>
    </MenuRadioGroupContext.Provider>);
}
