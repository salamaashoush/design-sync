import { mergeDefaultProps } from "@kobalte/utils";
import { Show, splitProps } from "solid-js";
import { Polymorphic } from "../polymorphic";
import { useMenuItemContext } from "./menu-item.context";
/**
 * The visual indicator rendered when the parent menu `CheckboxItem` or `RadioItem` is checked.
 * You can style this element directly, or you can use it as a wrapper to put an icon into, or both.
 */
export function MenuItemIndicator(props) {
    const context = useMenuItemContext();
    props = mergeDefaultProps({
        id: context.generateId("indicator"),
    }, props);
    const [local, others] = splitProps(props, ["forceMount"]);
    return (<Show when={local.forceMount || context.isChecked()}>
      <Polymorphic as="div" {...context.dataset()} {...others}/>
    </Show>);
}
