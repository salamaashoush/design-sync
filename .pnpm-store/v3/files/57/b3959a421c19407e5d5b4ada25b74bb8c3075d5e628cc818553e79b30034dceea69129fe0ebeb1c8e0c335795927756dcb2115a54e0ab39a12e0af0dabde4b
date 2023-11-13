import { mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { Show, splitProps } from "solid-js";
import { Polymorphic } from "../polymorphic";
import { createPresence } from "../primitives";
import { useRadioGroupItemContext } from "./radio-group-item-context";
/**
 * The visual indicator rendered when the radio item is in a checked state.
 * You can style this element directly, or you can use it as a wrapper to put an icon into, or both.
 */
export function RadioGroupItemIndicator(props) {
    const context = useRadioGroupItemContext();
    props = mergeDefaultProps({
        id: context.generateId("indicator"),
    }, props);
    const [local, others] = splitProps(props, ["ref", "forceMount"]);
    const presence = createPresence(() => local.forceMount || context.isSelected());
    return (<Show when={presence.isPresent()}>
      <Polymorphic as="div" ref={mergeRefs(presence.setRef, local.ref)} {...context.dataset()} {...others}/>
    </Show>);
}
