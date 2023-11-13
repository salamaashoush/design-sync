import { mergeRefs } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Polymorphic } from "../polymorphic";
import { usePopoverContext } from "./popover-context";
/**
 * An optional element to position the `Popover.Content` against.
 * If this part is not used, the content will position alongside the `Popover.Trigger`.
 */
export function PopoverAnchor(props) {
    const context = usePopoverContext();
    const [local, others] = splitProps(props, ["ref"]);
    return (<Polymorphic as="div" ref={mergeRefs(context.setDefaultAnchorRef, local.ref)} {...context.dataset()} {...others}/>);
}
