import { mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { MenuItemBase } from "./menu-item-base";
import { useMenuRadioGroupContext } from "./menu-radio-group-context";
/**
 * An item that can be controlled and rendered like a radio.
 */
export function MenuRadioItem(props) {
    const context = useMenuRadioGroupContext();
    props = mergeDefaultProps({ closeOnSelect: false }, props);
    const [local, others] = splitProps(props, ["value", "onSelect"]);
    const onSelect = () => {
        local.onSelect?.();
        context.setSelectedValue(local.value);
    };
    return (<MenuItemBase role="menuitemradio" checked={context.isSelectedValue(local.value)} onSelect={onSelect} {...others}/>);
}
