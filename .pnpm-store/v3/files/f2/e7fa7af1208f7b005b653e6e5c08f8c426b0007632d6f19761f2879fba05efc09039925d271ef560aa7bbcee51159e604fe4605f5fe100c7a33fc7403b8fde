import { mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { createToggleState } from "../primitives";
import { MenuItemBase } from "./menu-item-base";
/**
 * An item that can be controlled and rendered like a checkbox.
 */
export function MenuCheckboxItem(props) {
    props = mergeDefaultProps({
        closeOnSelect: false,
    }, props);
    const [local, others] = splitProps(props, ["checked", "defaultChecked", "onChange", "onSelect"]);
    const state = createToggleState({
        isSelected: () => local.checked,
        defaultIsSelected: () => local.defaultChecked,
        onSelectedChange: checked => local.onChange?.(checked),
        isDisabled: () => others.disabled,
    });
    const onSelect = () => {
        local.onSelect?.();
        state.toggle();
    };
    return (<MenuItemBase role="menuitemcheckbox" checked={state.isSelected()} onSelect={onSelect} {...others}/>);
}
