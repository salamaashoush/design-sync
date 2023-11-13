import { mergeDefaultProps } from "@kobalte/utils";
import { Show, splitProps } from "solid-js";
import { Polymorphic } from "../polymorphic";
import { useListboxItemContext } from "./listbox-item-context";
/**
 * The visual indicator rendered when the item is selected.
 * You can style this element directly, or you can use it as a wrapper to put an icon into, or both.
 */
export function ListboxItemIndicator(props) {
    const context = useListboxItemContext();
    props = mergeDefaultProps({
        id: context.generateId("indicator"),
    }, props);
    const [local, others] = splitProps(props, ["forceMount"]);
    return (<Show when={local.forceMount || context.isSelected()}>
      <Polymorphic as="div" aria-hidden="true" {...context.dataset()} {...others}/>
    </Show>);
}
